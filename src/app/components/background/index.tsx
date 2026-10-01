"use client";

import { useTheme } from "../../../context/tema";

// Sin tema (o en el profesional) va un fondo animado en CSS, sin video que descargar.
export default function BackgroundVideo() {
  const { theme } = useTheme();

  if (!theme?.video) {
    return (
      <div className="aurora-bg" aria-hidden>
        <span className="aurora-blob aurora-blob--1" />
        <span className="aurora-blob aurora-blob--2" />
        <span className="aurora-blob aurora-blob--3" />
        <span className="aurora-grid" />
      </div>
    );
  }

  return (
    <video
      key={theme.video}
      src={theme.video}
      autoPlay
      loop
      muted
      playsInline
      aria-hidden
      className="global-bg-video"
    />
  );
}
