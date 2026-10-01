"use client";

import { useEffect, useRef } from "react";
import { useSoundtrack, YTPlayer } from "../../../context/soundtrack";

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      width: string;
      height: string;
      host: string;
      playerVars: Record<string, number | string>;
      events: { onReady: () => void; onStateChange: (e: { data: number }) => void };
    },
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

// La API de YouTube se carga una sola vez, recién cuando se abre una radio que la usa
let apiPromise: Promise<YTNamespace> | null = null;

const cargarApi = () => {
  apiPromise ??= new Promise((resolve) => {
    if (window.YT?.Player) return resolve(window.YT);
    const previo = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previo?.();
      if (window.YT) resolve(window.YT);
    };
    const script = document.createElement("script");
    script.src = "https://www.youtube.com/iframe_api";
    script.async = true;
    document.head.appendChild(script);
  });
  return apiPromise;
};

// Reproductor visible: YouTube no permite reproducir solo el audio con el video escondido.
export default function YouTubeRadio() {
  const hostRef = useRef<HTMLDivElement>(null);
  const { attachYouTube, onYouTubeState } = useSoundtrack();

  useEffect(() => {
    let cancelado = false;
    let player: YTPlayer | null = null;
    let soltar: (() => void) | null = null;

    // El div que reemplaza YouTube no lo maneja React, así no choca al desmontar
    const slot = document.createElement("div");
    hostRef.current?.appendChild(slot);

    cargarApi().then((YT) => {
      if (cancelado) return;
      player = new YT.Player(slot, {
        width: "100%",
        height: "100%",
        host: "https://www.youtube-nocookie.com",
        playerVars: { controls: 0, rel: 0, playsinline: 1, modestbranding: 1, iv_load_policy: 3, disablekb: 1, fs: 0 },
        events: {
          onReady: () => {
            if (!cancelado && player) soltar = attachYouTube(player);
          },
          onStateChange: (e) => onYouTubeState(e.data),
        },
      });
    });

    return () => {
      cancelado = true;
      soltar?.();
      player?.destroy();
    };
  }, [attachYouTube, onYouTubeState]);

  return <div ref={hostRef} className="dock-video" />;
}
