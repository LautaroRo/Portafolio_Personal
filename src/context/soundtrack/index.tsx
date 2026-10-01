"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState, ReactNode } from "react";
import { useTheme } from "../tema";
import { Track, trackKey } from "../../constantes";

// Lo mínimo que se usa del reproductor de YouTube (IFrame API)
export type YTPlayer = {
  loadVideoById(id: string): void;
  cueVideoById(id: string): void;
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  setVolume(volume: number): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  destroy(): void;
};

const YT_ENDED = 0;
const YT_PLAYING = 1;
const YT_PAUSED = 2;

type SoundtrackContextType = {
  isPlaying: boolean;
  currentTrack: string | null; // clave del tema (ver trackKey)
  progress: number; // 0 a 100
  currentTime: number;
  duration: number;
  volume: number;
  playTrack: (key: string) => void;
  togglePlay: () => void;
  next: () => void;
  prev: () => void;
  seek: (ratio: number) => void;
  setVolume: (v: number) => void;
  stopTrack: () => void;
  attachYouTube: (player: YTPlayer) => () => void;
  onYouTubeState: (state: number) => void;
};

const SoundtrackContext = createContext<SoundtrackContextType | null>(null);

const esYouTube = (key: string | null) => !!key && key.startsWith("yt:");

export const SoundtrackProvider = ({ children }: { children: ReactNode }) => {
  const { themeId, theme } = useTheme();

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolumeState] = useState(0.7);
  const [trackTheme, setTrackTheme] = useState(themeId);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const ytRef = useRef<YTPlayer | null>(null);
  const pendingRef = useRef<string | null>(null); // video a cargar cuando el reproductor de YouTube esté listo
  const currentRef = useRef<string | null>(null);
  const volumeRef = useRef(0.7);
  const playlistRef = useRef<Track[]>(theme?.playlist ?? []);

  useEffect(() => {
    playlistRef.current = theme?.playlist ?? [];
  }, [theme]);

  const elegir = useCallback((key: string | null) => {
    currentRef.current = key;
    setCurrentTrack(key);
  }, []);

  const playTrack = useCallback(
    (key: string) => {
      const track = playlistRef.current.find((t) => trackKey(t) === key);
      if (!track) return;
      const audio = audioRef.current;
      const cambia = currentRef.current !== key;

      if (cambia) {
        setCurrentTime(0);
        setDuration(0);
      }
      elegir(key);

      if (track.youtube) {
        audio?.pause();
        if (ytRef.current) {
          if (cambia) ytRef.current.loadVideoById(track.youtube);
          else ytRef.current.playVideo();
        } else {
          pendingRef.current = track.youtube;
        }
        return;
      }

      ytRef.current?.pauseVideo();
      if (!audio || !track.file) return;
      if (audio.getAttribute("src") !== track.file) audio.src = track.file;
      audio.play().catch(() => setIsPlaying(false));
    },
    [elegir],
  );

  // Salta dentro de la lista del tema; da la vuelta al llegar a un extremo
  const step = useCallback(
    (delta: number) => {
      const playlist = playlistRef.current;
      if (!playlist.length) return;
      const index = playlist.findIndex((t) => trackKey(t) === currentRef.current);
      const nextIndex = index < 0 ? 0 : (index + delta + playlist.length) % playlist.length;
      playTrack(trackKey(playlist[nextIndex]));
    },
    [playTrack],
  );

  const next = useCallback(() => step(1), [step]);

  const prev = useCallback(() => {
    // Como en cualquier reproductor: si ya avanzó un poco, "anterior" vuelve al principio del tema
    const key = currentRef.current;
    const elapsed = esYouTube(key) ? (ytRef.current?.getCurrentTime() ?? 0) : (audioRef.current?.currentTime ?? 0);
    if (key && elapsed > 3) {
      if (esYouTube(key)) ytRef.current?.seekTo(0, true);
      else if (audioRef.current) audioRef.current.currentTime = 0;
    } else {
      step(-1);
    }
  }, [step]);

  const togglePlay = useCallback(() => {
    const key = currentRef.current;
    if (!key) {
      const first = playlistRef.current[0];
      if (first) playTrack(trackKey(first));
      return;
    }
    if (esYouTube(key)) {
      const yt = ytRef.current;
      if (!yt) return;
      if (yt.getPlayerState() === YT_PLAYING) yt.pauseVideo();
      else yt.playVideo();
      return;
    }
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) audio.play().catch(() => setIsPlaying(false));
    else audio.pause();
  }, [playTrack]);

  const seek = useCallback((ratio: number) => {
    const r = Math.min(Math.max(ratio, 0), 1);
    if (esYouTube(currentRef.current)) {
      const yt = ytRef.current;
      if (yt?.getDuration()) yt.seekTo(r * yt.getDuration(), true);
      return;
    }
    const audio = audioRef.current;
    if (audio?.duration) audio.currentTime = r * audio.duration;
  }, []);

  const setVolume = useCallback((v: number) => {
    const value = Math.min(Math.max(v, 0), 1);
    volumeRef.current = value;
    if (audioRef.current) audioRef.current.volume = value;
    ytRef.current?.setVolume(value * 100);
    setVolumeState(value);
  }, []);

  const stopTrack = useCallback(() => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
    ytRef.current?.pauseVideo();
    pendingRef.current = null;
    elegir(null);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(0);
  }, [elegir]);

  // El reproductor de YouTube vive en el panel de la radio y se registra al estar listo
  const attachYouTube = useCallback(
    (player: YTPlayer) => {
      ytRef.current = player;
      player.setVolume(volumeRef.current * 100);
      if (pendingRef.current) {
        player.loadVideoById(pendingRef.current);
        pendingRef.current = null;
      } else {
        // Muestra la portada del tema elegido (o del primero) sin arrancar
        const key = currentRef.current;
        const track = playlistRef.current.find((t) => trackKey(t) === key) ?? playlistRef.current.find((t) => t.youtube);
        if (track?.youtube) player.cueVideoById(track.youtube);
      }
      return () => {
        if (ytRef.current === player) ytRef.current = null;
        if (esYouTube(currentRef.current)) setIsPlaying(false);
      };
    },
    [],
  );

  const onYouTubeState = useCallback(
    (state: number) => {
      if (!esYouTube(currentRef.current)) return;
      if (state === YT_PLAYING) {
        setIsPlaying(true);
        setDuration(ytRef.current?.getDuration() ?? 0);
      } else if (state === YT_PAUSED) {
        setIsPlaying(false);
      } else if (state === YT_ENDED) {
        next();
      }
    },
    [next],
  );

  // YouTube no avisa el avance: se consulta mientras suena
  useEffect(() => {
    if (!isPlaying || !esYouTube(currentTrack)) return;
    const timer = window.setInterval(() => {
      const yt = ytRef.current;
      if (!yt) return;
      setCurrentTime(yt.getCurrentTime());
      setDuration(yt.getDuration());
    }, 250);
    return () => window.clearInterval(timer);
  }, [isPlaying, currentTrack]);

  useEffect(() => {
    const audio = new Audio();
    audio.preload = "none";
    audio.volume = volumeRef.current;
    audioRef.current = audio;

    const onTime = () => setCurrentTime(audio.currentTime);
    const onMeta = () => setDuration(audio.duration || 0);
    const onPlay = () => setIsPlaying(true);
    const onPause = () => !esYouTube(currentRef.current) && setIsPlaying(false);

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
    currentRef.current = null;
    pendingRef.current = null;
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.removeAttribute("src");
      audio.load();
    }
  }, [themeId]);

  const progress = duration ? Math.min((currentTime / duration) * 100, 100) : 0;

  return (
    <SoundtrackContext.Provider
      value={{
        isPlaying,
        currentTrack,
        progress,
        currentTime,
        duration,
        volume,
        playTrack,
        togglePlay,
        next,
        prev,
        seek,
        setVolume,
        stopTrack,
        attachYouTube,
        onYouTubeState,
      }}
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
