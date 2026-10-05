"use client";

import Image from "next/image";
import { CSSProperties, PointerEvent, useEffect, useRef, useState } from "react";
import { Briefcase, Check, ChevronUp, Music, Pause, Play, SkipBack, SkipForward, Volume1, Volume2, VolumeX, X } from "lucide-react";
import { useTheme } from "../../../context/tema";
import { useSoundtrack } from "../../../context/soundtrack";
import { THEMES, THEME_IDS, Theme, trackKey } from "../../../constantes";
import "./estilos.css";

type Panel = "mundos" | "radio" | null;

const tiempo = (s: number) => {
  if (!Number.isFinite(s) || s < 0) return "0:00";
  const m = Math.floor(s / 60);
  return `${m}:${String(Math.floor(s % 60)).padStart(2, "0")}`;
};

function Icono({ theme, size }: { theme: Theme | null; size: number }) {
  if (!theme?.icon) return <Briefcase size={size * 0.75} />;
  return <Image src={theme.icon} alt="" width={size} height={size} unoptimized={theme.icon.endsWith(".svg")} />;
}

function Ecualizador() {
  return (
    <span className="dock-eq" aria-hidden>
      <i />
      <i />
      <i />
      <i />
    </span>
  );
}

// Barra flotante con el selector de mundos y la radio del tema.
export default function Dock() {
  const { themeId, theme, setThemeId } = useTheme();
  const radio = useSoundtrack();
  const [panel, setPanel] = useState<Panel>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const playlist = theme?.playlist ?? [];
  const pista = playlist.find((t) => trackKey(t) === radio.currentTrack) ?? null;
  const actual = theme ?? THEMES.profesional;

  // Si el mundo nuevo no tiene radio, se cierra el reproductor
  const panelVisible = panel === "radio" && !playlist.length ? null : panel;

  useEffect(() => {
    if (!panelVisible) return;
    const onDown = (e: globalThis.PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setPanel(null);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setPanel(null);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [panelVisible]);

  const alternar = (p: Exclude<Panel, null>) => setPanel((actualPanel) => (actualPanel === p ? null : p));

  const buscar = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    radio.seek((e.clientX - rect.left) / rect.width);
  };

  const VolumenIcono = radio.volume === 0 ? VolumeX : radio.volume < 0.5 ? Volume1 : Volume2;

  return (
    <div className={`dock ${panelVisible ? "has-panel" : ""}`} ref={rootRef}>
      {/* En el celular los paneles son hojas que suben desde abajo: el velo cierra al tocar afuera */}
      {panelVisible && <div className="dock-backdrop" onClick={() => setPanel(null)} aria-hidden />}

      {panelVisible === "mundos" && (
        <div className="dock-panel dock-mundos" role="dialog" aria-label="Elegí un mundo">
          <div className="dock-panel-head">
            <span>Elegí un mundo</span>
            <button type="button" className="dock-icon-btn" onClick={() => setPanel(null)} aria-label="Cerrar">
              <X size={16} />
            </button>
          </div>

          <div className="dock-tiles">
            {THEME_IDS.map((id, i) => {
              const opcion = THEMES[id];
              const activo = id === themeId || (!themeId && id === "profesional");
              return (
                <button
                  key={id}
                  type="button"
                  aria-pressed={activo}
                  className={`dock-tile ${activo ? "active" : ""}`}
                  style={{ "--a": opcion.swatch[0], "--b": opcion.swatch[1], animationDelay: `${i * 40}ms` } as CSSProperties}
                  onClick={() => {
                    setThemeId(id);
                    setPanel(null);
                    // Cada mundo arranca desde arriba, en el inicio
                    const suave = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
                    window.scrollTo({ top: 0, behavior: suave ? "smooth" : "auto" });
                  }}
                >
                  <span className="dock-tile-icon">
                    <Icono theme={opcion} size={30} />
                  </span>
                  <span className="dock-tile-name">{opcion.name}</span>
                  <span className="dock-tile-tag">{opcion.tagline}</span>
                  {activo && (
                    <span className="dock-tile-check" aria-hidden>
                      <Check size={13} strokeWidth={3} />
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {panelVisible === "radio" && (
        <div className="dock-panel dock-player" role="dialog" aria-label={actual.title}>
          <div className="dock-player-top">
            <span
              className={`dock-cover ${radio.isPlaying ? "spinning" : ""}`}
              style={{ "--a": actual.swatch[0], "--b": actual.swatch[1] } as CSSProperties}
            >
              <Icono theme={actual} size={34} />
            </span>
            <div className="dock-player-info">
              <span className="dock-player-station">{actual.title}</span>
              <strong className="dock-player-track">{pista?.title ?? "Elegí un tema"}</strong>
            </div>
            <button type="button" className="dock-icon-btn" onClick={() => setPanel(null)} aria-label="Cerrar radio">
              <X size={16} />
            </button>
          </div>

          <div
            className="dock-progress"
            role="slider"
            aria-label="Posición del tema"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={Math.round(radio.progress)}
            tabIndex={0}
            onPointerDown={buscar}
            onKeyDown={(e) => {
              if (e.key === "ArrowRight") radio.seek(radio.progress / 100 + 0.05);
              if (e.key === "ArrowLeft") radio.seek(radio.progress / 100 - 0.05);
            }}
          >
            <span className="dock-progress-fill" style={{ width: `${radio.progress}%` }} />
            <span className="dock-progress-knob" style={{ left: `${radio.progress}%` }} />
          </div>
          <div className="dock-times">
            <span>{tiempo(radio.currentTime)}</span>
            <span>{tiempo(radio.duration)}</span>
          </div>

          <div className="dock-controls">
            <button type="button" className="dock-icon-btn" onClick={radio.prev} aria-label="Anterior">
              <SkipBack size={20} />
            </button>
            <button type="button" className="dock-play" onClick={radio.togglePlay} aria-label={radio.isPlaying ? "Pausar" : "Reproducir"}>
              {radio.isPlaying ? <Pause size={22} /> : <Play size={22} className="dock-play-icon" />}
            </button>
            <button type="button" className="dock-icon-btn" onClick={radio.next} aria-label="Siguiente">
              <SkipForward size={20} />
            </button>
          </div>

          <div className="dock-volume">
            <button
              type="button"
              className="dock-icon-btn"
              onClick={() => radio.setVolume(radio.volume === 0 ? 0.7 : 0)}
              aria-label={radio.volume === 0 ? "Activar sonido" : "Silenciar"}
            >
              <VolumenIcono size={16} />
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={radio.volume}
              onChange={(e) => radio.setVolume(Number(e.target.value))}
              aria-label="Volumen"
              style={{ "--v": `${radio.volume * 100}%` } as CSSProperties}
            />
          </div>

          <ul className="dock-tracks">
            {playlist.map((track, i) => {
              const key = trackKey(track);
              const esta = radio.currentTrack === key;
              return (
                <li key={key}>
                  <button
                    type="button"
                    className={`dock-track ${esta ? "active" : ""}`}
                    onClick={() => (esta ? radio.togglePlay() : radio.playTrack(key))}
                  >
                    <span className="dock-track-num">{esta && radio.isPlaying ? <Ecualizador /> : i + 1}</span>
                    <span className="dock-track-title">{track.title}</span>
                    <span className="dock-track-action" aria-hidden>
                      {esta && radio.isPlaying ? <Pause size={14} /> : <Play size={14} />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      <div className="dock-bar">
        <button
          type="button"
          className={`dock-world ${panelVisible === "mundos" ? "open" : ""}`}
          onClick={() => alternar("mundos")}
          aria-expanded={panelVisible === "mundos"}
          aria-label={`Mundo actual: ${actual.name}. Cambiar de mundo`}
        >
          <span key={themeId ?? "base"} className="dock-world-icon">
            <Icono theme={actual} size={26} />
          </span>
          <span className="dock-world-text">
            <small>Mundo</small>
            <strong>{actual.name}</strong>
          </span>
          <ChevronUp size={16} className="dock-chevron" />
        </button>

        {playlist.length > 0 && (
          <>
            <span className="dock-sep" aria-hidden />
            <button
              type="button"
              className={`dock-radio ${radio.isPlaying ? "playing" : ""} ${panelVisible === "radio" ? "open" : ""}`}
              onClick={() => alternar("radio")}
              aria-expanded={panelVisible === "radio"}
              aria-label={radio.isPlaying && pista ? `Sonando: ${pista.title}. Abrir radio` : "Abrir radio"}
            >
              {radio.isPlaying ? <Ecualizador /> : <Music size={18} />}
              <span className="dock-radio-text">{radio.isPlaying && pista ? pista.title : "Radio"}</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
