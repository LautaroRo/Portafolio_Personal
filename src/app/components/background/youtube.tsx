"use client";

import { useState } from "react";

// Video de YouTube como fondo: sin controles, en silencio y en loop.
// Se reproduce desde YouTube (el canal permite incrustarlo); no se descarga ni se sube al repo.
export default function YouTubeBackground({ id }: { id: string }) {
  const [listo, setListo] = useState(false);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: id, // necesario para que loop funcione con un solo video
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
  });

  return (
    <div className={`yt-bg ${listo ? "is-ready" : ""}`} aria-hidden>
      <iframe
        src={`https://www.youtube-nocookie.com/embed/${id}?${params}`}
        title="Fondo animado"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
        // El reproductor tarda un momento en arrancar después de cargar: recién ahí se muestra
        onLoad={() => window.setTimeout(() => setListo(true), 1200)}
      />
    </div>
  );
}
