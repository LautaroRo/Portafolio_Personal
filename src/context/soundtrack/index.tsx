"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useTheme } from "../tema";

type SoundtrackContextType = {
  isPlaying: boolean;
  currentTrack: string | null;
  progress: number; // 0 a 100
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (file: string) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  setVolume: (v: number) => void;
  stopTrack: () => void;
};

const SoundtrackContext = createContext<SoundtrackContextType | null>(null);

export const SoundtrackProvider = ({ children }: { children: ReactNode }) => {
  const { themeId, theme } = useTheme();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [trackTheme, setTrackTheme] = useState(themeId);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playlistRef = useRef(theme?.playlist ?? []);

  useEffect(() => {
    playlistRef.current = theme?.playlist ?? [];
  }, [theme]);

  const playTrack = useCallback((file: string) => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.getAttribute("src") !== file) {
      audio.src = file;
      setCurrentTime(0);
      setDuration(0);
    }

    setCurrentTrack(file);
    audio.play().catch(() => setIsPlaying(false));
  }, []);

  // Salta dentro de la lista del tema; da la vuelta al llegar a un extremo
  const step = useCallback(
    (delta: number) => {
      const playlist = playlistRef.current;
      if (!playlist.length) return;
      const index = playlist.findIndex((t) => t.file === audioRef.current?.getAttribute("src"));
      const nextIndex = index < 0 ? 0 : (index + delta + playlist.length) % playlist.length;
      playTrack(playlist[nextIndex].file);
    },
    [playTrack],
  );

  const next = useCallback(() => step(1), [step]);

  const prev = useCallback(() => {
    // Como en cualquier reproductor: si ya avanzó un poco, "anterior" vuelve al principio del tema
    const audio = audioRef.current;
    if (audio && audio.currentTime > 3) audio.currentTime = 0;
    else step(-1);
  }, [step]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (!audio.getAttribute("src")) {
      const first = playlistRef.current[0];
      if (first) playTrack(first.file);
    } else if (audio.paused) {
      audio.play().catch(() => setIsPlaying(false));
    } else {
      audio.pause();
    }
  }, [playTrack]);

  const seek = useCallback((ratio: number) => {
    const audio = audioRef.current;
    if (audio?.duration) audio.currentTime = Math.min(Math.max(ratio, 0), 1) * audio.duration;
  }, []);

  const setVolume = useCallback((v: number) => {
    const value = Math.min(Math.max(v, 0), 1);
    if (audioRef.current) audioRef.current.volume = value;
    setVolumeState(value);
  }, []);

  const stopTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    setDuration(0);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = 0.7;
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => setIsPlaying(false);

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("play", onPlay);
    audio.addEventListener("pause", onPause);
    // Al terminar un tema sigue con el próximo, como una radio
    audio.addEventListener("ended", next);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("play", onPlay);
      audio.removeEventListener("pause", onPause);
      audio.removeEventListener("ended", next);
      audioRef.current = null;
    };
  }, [next]);

  // Cambiar de tema corta la música: la lista del tema anterior ya no aplica.
  if (trackTheme !== themeId) {
    setTrackTheme(themeId);
    setIsPlaying(false);
    setCurrentTrack(null);
    setCurrentTime(0);
    setDuration(0);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  }, [themeId]);

  const progress = duration ? (currentTime / duration) * 100 : 0;

  return (
    <SoundtrackContext.Provider
      value={{ isPlaying, currentTrack, progress, currentTime, duration, volume, playTrack, togglePlay, next, prev, seek, setVolume, stopTrack }}
    >
      {children}
    </SoundtrackContext.Provider>
  );
};

export const useSoundtrack = () => {
  const context = useContext(SoundtrackContext);

  if (!context) {
    throw new Error("useSoundtrack debe usarse dentro de SoundtrackProvider");
  }

  return context;
};
