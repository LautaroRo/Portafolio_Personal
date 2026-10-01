"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useTheme } from "../tema";

type SoundtrackContextType = {
  isPlaying: boolean;
  currentTrack: string | null;
  progress: number;
  playTrack: (file: string) => void;
  stopTrack: () => void;
};

const SoundtrackContext = createContext<SoundtrackContextType | null>(null);

export const SoundtrackProvider = ({ children }: { children: ReactNode }) => {
  const { themeId, theme } = useTheme();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
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
      setProgress(0);
    }

    audio.play().catch(() => setIsPlaying(false));
    setIsPlaying(true);
    setCurrentTrack(file);
  }, []);

  const stopTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setCurrentTrack(null);
    setProgress(0);
  }, []);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audioRef.current = audio;

    const onTime = () => {
      if (audio.duration) setProgress((audio.currentTime / audio.duration) * 100);
    };

    // Al terminar un tema sigue con el próximo de la lista, como una radio.
    const onEnded = () => {
      const playlist = playlistRef.current;
      const index = playlist.findIndex((t) => t.file === audio.getAttribute("src"));
      const next = playlist[index + 1];
      if (next) playTrack(next.file);
      else stopTrack();
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.pause();
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("ended", onEnded);
      audioRef.current = null;
    };
  }, [playTrack, stopTrack]);

  // Cambiar de tema corta la música: la lista del tema anterior ya no aplica.
  if (trackTheme !== themeId) {
    setTrackTheme(themeId);
    setIsPlaying(false);
    setCurrentTrack(null);
    setProgress(0);
  }

  useEffect(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }, [themeId]);

  return (
    <SoundtrackContext.Provider value={{ isPlaying, currentTrack, progress, playTrack, stopTrack }}>
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
