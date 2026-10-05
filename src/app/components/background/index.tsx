"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useTheme } from "../../../context/tema";
import { getTheme, type ThemeId } from "../../../constantes";
import ViceScene from "./vice";
import YouTubeBackground from "./youtube";

// Cada fondo es una "capa". Al cambiar de mundo, la capa nueva se monta encima y recién se ve
// cuando está lista (el video ya tiene un fotograma); mientras tanto sigue la anterior.
// Así nunca queda un instante en negro entre un mundo y otro.
type Capa = { clave: string; themeId: ThemeId | null; lista: boolean };

const claveDe = (id: ThemeId | null) => id ?? "base";
const FUNDIDO_MS = 700;

function Fondo({ themeId, onLista }: { themeId: ThemeId | null; onLista: () => void }) {
  const theme = getTheme(themeId);
  const avisado = useRef(false);
  const avisar = useCallback(() => {
    if (avisado.current) return;
    avisado.current = true;
    onLista();
  }, [onLista]);

  // Las escenas hechas con CSS están listas apenas se dibujan
  const esVideo = !!theme?.video;
  useEffect(() => {
    if (!esVideo) {
      const raf = requestAnimationFrame(avisar);
      return () => cancelAnimationFrame(raf);
    }
    // Si el video tarda demasiado (conexión lenta), igual se muestra
    const t = window.setTimeout(avisar, 4000);
    return () => window.clearTimeout(t);
  }, [esVideo, avisar]);

  if (theme?.video) {
    return (
      <video
        src={theme.video}
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
  const [capas, setCapas] = useState<Capa[]>(() => [{ clave: claveDe(themeId), themeId, lista: true }]);

  // Cambió el mundo: se suma la capa nueva arriba de la última que ya se veía
  const clave = claveDe(themeId);
  if (capas[capas.length - 1].clave !== clave) {
    const visibles = capas.filter((c) => c.lista && c.clave !== clave);
    setCapas([...visibles.slice(-1), { clave, themeId, lista: false }]);
  }

  const marcarLista = useCallback((c: string) => {
    setCapas((cs) => cs.map((x) => (x.clave === c ? { ...x, lista: true } : x)));
    // Terminado el fundido, las capas de abajo ya no se ven: se desmontan (y sus videos dejan de bajar)
    window.setTimeout(() => {
      setCapas((cs) => {
        const i = cs.findIndex((x) => x.clave === c);
        return i > 0 && cs[i].lista ? cs.slice(i) : cs;
      });
    }, FUNDIDO_MS + 50);
  }, []);

  return (
    <>
      {capas.map((c) => (
        <div key={c.clave} className={`bg-capa ${c.lista ? "is-lista" : ""}`} aria-hidden>
          <Fondo themeId={c.themeId} onLista={() => marcarLista(c.clave)} />
        </div>
      ))}
    </>
  );
}
