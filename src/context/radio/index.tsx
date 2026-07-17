"use client";

import { useState } from "react";
import { Radio, Play, Pause, X, Music } from "lucide-react";
import { useTheme } from "./../tema/index";
import { useSoundtrack } from "./../soundtrack/index";
import { THEMES } from "./../../constantes/index";
import "./estilos.css";

export default function RadioPlayer() {
  const [isOpen, setIsOpen] = useState(false);

  const { themeId } = useTheme();

  const {
    isPlaying,
    playTrack,
    stopTrack,
    currentTrack,
    progress,
  } = useSoundtrack();

  const activeTheme = themeId
    ? THEMES[themeId as keyof typeof THEMES]
    : null;

  // Si el tema no tiene playlist, no mostrar el reproductor
  if (!activeTheme?.playlist || activeTheme.playlist.length === 0) {
    return null;
  }

  const playClickSound = () => {
    if (!activeTheme?.clickSound) return;

    const audio = new Audio(activeTheme.clickSound);

    audio.play().catch(() => {});
  };

  return (
    <div className="radioContainer">
      {!isOpen ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            playClickSound();
            setIsOpen(true);
          }}
          className="triggerButton"
        >
          <Radio size={24} />
        </button>
      ) : (
        <div className="playerWindow">
          <div className="header">
            <span>
              <Music size={14} /> {activeTheme.title ?? "RADIO"}
            </span>

            <X
              size={16}
              onClick={(e) => {
                e.stopPropagation();
                playClickSound();
                setIsOpen(false);
              }}
              style={{ cursor: "pointer" }}
            />
          </div>

          <div className="progressBarContainer">
            <div
              className="progressBar"
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="trackList">
            {activeTheme.playlist.map((track) => (
              <div
                key={track.title}
                className="trackItem"
              >
                <span className="trackTitle">
                  {track.title}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    playClickSound();

                    if (
                      isPlaying &&
                      currentTrack === track.file
                    ) {
                      stopTrack();
                    } else {
                      playTrack(track.file);
                    }
                  }}
                  className="playButton"
                >
                  {isPlaying &&
                  currentTrack === track.file ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}