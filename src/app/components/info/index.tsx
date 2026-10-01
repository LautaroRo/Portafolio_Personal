"use client";

import { useState } from "react";
import { useTextos, useTheme } from "../../../context/tema";
import Typewriter from "./typewriter";
import "./estilos.css";

// Frases amarillas del menú de Minecraft: un clic pasa a la siguiente.
const SPLASHES = [
  "¡Ahora con TypeScript!",
  "¡100% bloques de código!",
  "¡Sin creepers en producción!",
  "¡Compila a la primera!",
  "¡Renderizado del lado del servidor!",
  "¡También en modo oscuro!",
];

export default function Info() {
  const { themeId } = useTheme();
  const t = useTextos();
  const [splash, setSplash] = useState(0);

  return (
    <section id="info" className="info-section">
      <div className="info-content">
        {themeId === "silenthill" && <p className="hero-kicker">En mis sueños inquietos, veo este portafolio...</p>}

        {themeId === "thelastofus" && (
          <p className="hero-kicker">
            <span className="firefly" aria-hidden /> Cuando estés perdido en la oscuridad, buscá la luz
          </p>
        )}

        {themeId === "gta6" && <p className="hero-kicker">Vice City · Estado de Leonida</p>}

        {themeId === "redead" && (
          <div className="wanted-head" aria-hidden>
            <span className="wanted-title">SE BUSCA</span>
            <span className="wanted-sub">vivo · por escribir buen código</span>
          </div>
        )}

        {/* Monograma animado: si algún día sumás una foto, va adentro de .avatar-core */}
        <div className="avatar" aria-hidden>
          <span className="avatar-ring" />
          <span className="avatar-core">L</span>
        </div>

        <h1 className="hero-title">
          Hola, soy <span className="hero-name">Lautaro</span>
          <span className="hero-wave" aria-hidden>
            👋
          </span>
          {themeId === "minecraft" && (
            <button
              type="button"
              className="mc-splash"
              onClick={() => setSplash((s) => (s + 1) % SPLASHES.length)}
              title="Otra frase"
            >
              {SPLASHES[splash]}
            </button>
          )}
        </h1>

        <p className="hero-role">
          {t["hero.role"]} <Typewriter />
        </p>

        <p className="hero-bio">
          Estudiante de Ingeniería en Software en la Universidad Siglo 21. Tengo 22 años y una verdadera pasión por la
          programación. Me destaco por mi alta adaptabilidad y sólidas soft skills para el trabajo en equipo.
        </p>

        {themeId === "redead" && (
          <p className="wanted-reward" aria-hidden>
            Recompensa: <strong>tu próximo proyecto</strong>
          </p>
        )}

        <div className="hero-actions">
          <a href="#proyectos" className="hero-btn hero-btn--primary">
            {t["hero.primary"]}
          </a>
          <a href="#contacto" className="hero-btn">
            {t["hero.secondary"]}
          </a>
        </div>
      </div>

      <a href="#habilidades" className="scroll-cue" aria-label="Bajar a habilidades">
        <span />
      </a>
    </section>
  );
}
