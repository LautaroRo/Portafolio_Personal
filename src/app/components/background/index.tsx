"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../context/tema";
import { getTheme, type ThemeId } from "../../../constantes";
import ViceScene from "./vice";
import YouTubeBackground from "./youtube";

// Cada fondo es una "capa". Al cambiar de mundo, la capa nueva se monta encima y recién se ve
// cuando está lista (el video ya tiene un fotograma); mientras tanto sigue la anterior.
// Así nunca queda un instante en negro entre un mundo y otro.
// lista = ya tiene imagen y empieza a aparecer; completa = terminó de aparecer (tapa todo lo de abajo)
type Capa = { clave: string; themeId: ThemeId | null; lista: boolean; completa: boolean };

const claveDe = (id: ThemeId | null) => id ?? "base";
// Primer cuadro de cada video (public/fondos_img/*-poster.jpg): se ve al instante mientras el video
// carga, y queda de fondo si el celular no lo reproduce solo (iPhone en ahorro de batería)
const posterDe = (video: string) => video.replace(/\.mp4$/, "-poster.jpg");

function Fondo({ themeId, onLista }: { themeId: ThemeId | null; onLista: () => void }) {
  const theme = getTheme(themeId);
  const avisado = useRef(false);
  const avisar = useCallback(() => {
    if (avisado.current) return;
    avisado.current = true;
    onLista();
  }, [onLista]);

  // Las escenas hechas con CSS están listas apenas se dibujan; un video, cuando cargó su imagen fija
  const video = theme?.video ?? null;
  useEffect(() => {
    if (!video) {
      const raf = requestAnimationFrame(avisar);
      return () => cancelAnimationFrame(raf);
    }
    const img = new Image();
    img.onload = avisar;
    img.src = posterDe(video);
    // Si hasta la imagen tarda demasiado (conexión muy lenta), igual se muestra
    const t = window.setTimeout(avisar, 4000);
    return () => {
      img.onload = null;
      window.clearTimeout(t);
    };
  }, [video, avisar]);

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
        onLoadedData={avisar}
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

export default function BackgroundVideo() {
  const { themeId } = useTheme();
  const [capas, setCapas] = useState<Capa[]>(() => [{ clave: claveDe(themeId), themeId, lista: true, completa: true }]);

  // Cambió el mundo: la capa nueva va arriba de la última que ya se veía entera.
  // Si se cambia rápido varias veces, las intermedias a medio aparecer se descartan.
  const clave = claveDe(themeId);
  if (capas[capas.length - 1].clave !== clave) {
    const base = capas.filter((c) => c.completa && c.clave !== clave).slice(-1);
    setCapas([...base, { clave, themeId, lista: false, completa: false }]);
  }

  // Recién cuando la capa nueva terminó de aparecer se desmontan las de abajo (y sus videos dejan de bajar)
  const marcarCompleta = useCallback((c: string) => {
    setCapas((cs) => {
      const i = cs.findIndex((x) => x.clave === c);
      if (i < 0 || !cs[i].lista || (i === 0 && cs[0].completa)) return cs;
      return cs.slice(i).map((x, j) => (j === 0 ? { ...x, completa: true } : x));
    });
  }, []);

  const marcarLista = useCallback(
    (c: string) => {
      setCapas((cs) => cs.map((x) => (x.clave === c ? { ...x, lista: true } : x)));
      // Respaldo: con las animaciones desactivadas el navegador no avisa el final del fundido
      window.setTimeout(() => marcarCompleta(c), 1500);
    },
    [marcarCompleta],
  );

  return (
    <>
      {capas.map((c) => (
        <div
          key={c.clave}
          className={`bg-capa ${c.lista ? "is-lista" : ""}`}
          aria-hidden
          onTransitionEnd={(e) => e.target === e.currentTarget && e.propertyName === "opacity" && c.lista && marcarCompleta(c.clave)}
        >
          <Fondo themeId={c.themeId} onLista={() => marcarLista(c.clave)} />
        </div>
      ))}
    </>
  );
}
