"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../context/tema";
import { getTheme, type ThemeId } from "../../../constantes";
import ViceScene from "./vice";
import YouTubeBackground from "./youtube";

// Cada fondo es una "capa". Al cambiar de mundo, la capa nueva se monta encima y recién se ve
// cuando tiene imagen; mientras tanto sigue la anterior. Cuando terminó de aparecer, las de abajo
// se desmontan. Así nunca queda un instante en negro entre un mundo y otro.
//
// Cada capa maneja sola si está lista: el padre solo guarda la lista de capas. Antes ese estado
// vivía en el padre y, con el celular cargado, React podía rehacer la lista desde una versión
// vieja: la capa nueva perdía la marca de "lista" y quedaba invisible (fondo viejo o negro).
type Capa = { id: string; themeId: ThemeId | null; n: number };

// Primer cuadro de cada video (public/fondos_img/*-poster.jpg): se ve al instante mientras el video
// carga, y queda de fondo si el celular no lo reproduce solo (iPhone en ahorro de batería)
const posterDe = (video: string) => video.replace(/\.mp4$/, "-poster.jpg");

function Fondo({ themeId, onLista }: { themeId: ThemeId | null; onLista: () => void }) {
  const theme = getTheme(themeId);
  const video = theme?.video ?? null;

  // Las escenas hechas con CSS están listas apenas se dibujan; un video, cuando cargó su imagen fija
  useEffect(() => {
    if (!video) {
      const raf = requestAnimationFrame(onLista);
      return () => cancelAnimationFrame(raf);
    }
    const img = new Image();
    img.onload = onLista;
    img.src = posterDe(video);
    // Si hasta la imagen tarda demasiado (conexión muy lenta), igual se muestra
    const t = window.setTimeout(onLista, 4000);
    return () => {
      img.onload = null;
      window.clearTimeout(t);
    };
  }, [video, onLista]);

  if (video) {
    return (
      <video
        src={video}
        poster={posterDe(video)}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        aria-hidden
        className="global-bg-video"
        onLoadedData={onLista}
      />
    );
  }

  if (theme?.scene === "vice") {
    return (
      <>
        <ViceScene />
        {theme.youtube && <YouTubeBackground id={theme.youtube} />}
      </>
    );
  }

  return (
    <div className="aurora-bg" aria-hidden>
      <span className="aurora-blob aurora-blob--1" />
      <span className="aurora-blob aurora-blob--2" />
      <span className="aurora-blob aurora-blob--3" />
      <span className="aurora-grid" />
    </div>
  );
}

function CapaFondo({ capa, inicial, onCompleta }: { capa: Capa; inicial: boolean; onCompleta: (id: string) => void }) {
  // La primera capa de la página se ve de entrada; las que llegan después, cuando están listas
  const [lista, setLista] = useState(inicial);
  const completada = useRef(false);

  const completar = useCallback(() => {
    if (completada.current) return;
    completada.current = true;
    onCompleta(capa.id);
  }, [onCompleta, capa.id]);

  const marcarLista = useCallback(() => setLista(true), []);

  // Respaldo: con las animaciones desactivadas el navegador no avisa el final del fundido
  useEffect(() => {
    if (!lista) return;
    const t = window.setTimeout(completar, 1500);
    return () => window.clearTimeout(t);
  }, [lista, completar]);

  return (
    <div
      className={`bg-capa ${lista ? "is-lista" : ""}`}
      aria-hidden
      onTransitionEnd={(e) => {
        if (lista && e.target === e.currentTarget && e.propertyName === "opacity") completar();
      }}
    >
      <Fondo themeId={capa.themeId} onLista={marcarLista} />
    </div>
  );
}

export default function BackgroundVideo() {
  const { themeId } = useTheme();
  const [capas, setCapas] = useState<Capa[]>(() => [{ id: `${themeId ?? "base"}-0`, themeId, n: 0 }]);

  // Cambió el mundo: se suma una capa nueva arriba. El id es único (lleva un número de orden), así
  // volver a un mundo cuya capa todavía no se retiró monta una nueva en vez de reusar la vieja.
  const ultima = capas[capas.length - 1];
  if (ultima.themeId !== themeId) {
    const n = ultima.n + 1;
    setCapas([...capas, { id: `${themeId ?? "base"}-${n}`, themeId, n }]);
  }

  // La capa terminó de aparecer: todo lo de abajo ya no se ve, se desmonta (y sus videos dejan de bajar)
  const alCompletar = useCallback((id: string) => {
    setCapas((cs) => {
      const i = cs.findIndex((c) => c.id === id);
      return i > 0 ? cs.slice(i) : cs;
    });
  }, []);

  return (
    <>
      {capas.map((c, i) => (
        <CapaFondo key={c.id} capa={c} inicial={i === 0 && c.n === 0} onCompleta={alCompletar} />
      ))}
    </>
  );
}
