"use client";

import { useEffect, useState } from "react";
import { Radio, Play, Pause, X, Music } from "lucide-react";
import { useTheme } from "../tema";
import { useSoundtrack } from "../soundtrack";
import "./estilos.css";

// El sonido de clic lo pone ClickSoundProvider para toda la página; acá no se repite.
export default function RadioPlayer() {
  const [isOpen, setIsOpen] = useState(false);
  const { theme } = useTheme();
  const { isPlaying, playTrack, stopTrack, currentTrack, progress } = useSoundtrack();

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setIsOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  if (!theme?.playlist.length) return null;

  return (
    <div className="radioContainer">
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className={`triggerButton ${isPlaying ? "is-playing" : ""}`}
          aria-label="Abrir radio"
          title="Radio"
        >
          <Radio size={24} />
          {isPlaying && <span className="radioPulse" aria-hidden />}
        </button>
      ) : (
        <div className="playerWindow" role="dialog" aria-label={theme.title}>
          <div className="header">
            <span className="headerTitle">
              <Music size={14} /> {theme.title}
            </span>

            <button type="button" className="closeButton" onClick={() => setIsOpen(false)} aria-label="Cerrar radio">
              <X size={16} />
            </button>
          </div>

          <div className="progressBarContainer">
            <div className="progressBar" style={{ width: `${progress}%` }} />
          </div>

          <ul className="trackList">
            {theme.playlist.map((track, i) => {
              const active = isPlaying && currentTrack === track.file;
              return (
                <li key={track.file} className={`trackItem ${active ? "active" : ""}`} style={{ animationDelay: `${i * 60}ms` }}>
                  {active ? (
                    <span className="equalizer" aria-hidden>
                      <i /><i /><i />
                    </span>
                  ) : (
                    <span className="trackNumber">{i + 1}</span>
                  )}
                  <span className="trackTitle">{track.title}</span>

                  <button
                    type="button"
                    onClick={() => (active ? stopTrack() : playTrack(track.file))}
                    className="playButton"
                    aria-label={active ? `Pausar ${track.title}` : `Reproducir ${track.title}`}
                  >
                    {active ? <Pause size={18} /> : <Play size={18} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
}
