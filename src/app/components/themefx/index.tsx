"use client";

import { useEffect, useRef, useState } from "react";
import { useTheme } from "../../../context/tema";
import type { ThemeId } from "../../../constantes";
import Particles from "./particles";
import "./estilos.css";

// Linterna de Silent Hill: oscurece todo menos un círculo alrededor del mouse.
function Flashlight() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(pointer: coarse)").matches) return;

    let frame = 0;
    let x = window.innerWidth / 2;
    let y = window.innerHeight / 2;

    const apply = () => {
      frame = 0;
      el.style.setProperty("--fx", `${x}px`);
      el.style.setProperty("--fy", `${y}px`);
    };

    const onMove = (e: PointerEvent) => {
      x = e.clientX;
      y = e.clientY;
      if (!frame) frame = requestAnimationFrame(apply);
    };

    apply();
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  return <div ref={ref} className="fx-flashlight" aria-hidden />;
}

// HUD de GTA: la plata sube y las estrellas de búsqueda se encienden a medida que se baja.
function GtaHud() {
  const moneyRef = useRef<HTMLSpanElement>(null);
  const starsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? Math.min(window.scrollY / max, 1) : 0;
      if (moneyRef.current) moneyRef.current.textContent = Math.round(1000 + ratio * 999000).toLocaleString("en-US");
      const lit = Math.ceil(ratio * 6);
      starsRef.current?.querySelectorAll("i").forEach((star, i) => star.classList.toggle("on", i < lit));
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div className="gta-hud" aria-hidden>
      {/* GTA VI tiene seis estrellas de búsqueda */}
      <div ref={starsRef} className="gta-stars">
        <i />
        <i />
        <i />
        <i />
        <i />
        <i />
      </div>
      <p className="gta-money">
        $<span ref={moneyRef}>1,000</span>
      </p>
    </div>
  );
}

// Pantalla de entrada de cada mundo. Se va sola o con un clic.
function Intro({ theme }: { theme: ThemeId }) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  const cerrar = () => setVisible(false);
  const props = {
    className: `fx-intro fx-intro--${theme}`,
    // Solo la animación de salida: las de los hijos y los ::before también disparan este evento
    onAnimationEnd: (e: React.AnimationEvent) => e.animationName === "intro-out" && cerrar(),
    onClick: cerrar,
    role: "presentation",
  };

  switch (theme) {
    case "minecraft":
      return (
        <div {...props}>
          <p className="mc-intro-title">Generando el mundo</p>
          <p className="mc-intro-sub">Construyendo el terreno</p>
          <div className="mc-intro-bar">
            <span />
          </div>
        </div>
      );
    case "silenthill":
      return (
        <div {...props}>
          <p className="sh-intro-text">Hay algo en la niebla...</p>
        </div>
      );
    case "thelastofus":
      return (
        <div {...props}>
          <span className="tlou-intro-firefly" />
          <p className="tlou-intro-text">Resistir y sobrevivir</p>
        </div>
      );
    case "redead":
      return (
        <div {...props}>
          <p className="rdr-intro-chapter">Capítulo I</p>
          <p className="rdr-intro-title">El Portafolio</p>
        </div>
      );
    case "gta6":
      return (
        <div {...props}>
          <p className="gta-intro-welcome">Bienvenido a</p>
          <p className="gta-intro-title">Leonida</p>
          <p className="gta-intro-sub">Vice City · Estado de Leonida</p>
        </div>
      );
    default:
      return null;
  }
}

export default function ThemeFX() {
  const { themeId } = useTheme();
  const [prev, setPrev] = useState(themeId);
  const [intro, setIntro] = useState<ThemeId | null>(null);

  // La intro sale cada vez que se entra a un mundo (también al recargar con uno guardado).
  // Con ?intro=0 se saltea (sirve para compartir un link directo sin la pantalla de carga).
  if (prev !== themeId) {
    setPrev(themeId);
    setIntro(new URLSearchParams(window.location.search).get("intro") === "0" ? null : themeId);
  }

  return (
    <>
      {themeId === "minecraft" && <Particles kind="petals" />}

      {themeId === "silenthill" && (
        <>
          <Particles kind="ash" />
          <div className="fx-fog" aria-hidden>
            <span />
            <span />
          </div>
          <Flashlight />
        </>
      )}

      {themeId === "thelastofus" && (
        <>
          <Particles kind="spores" />
          <div className="fx-vignette fx-vignette--green" aria-hidden />
        </>
      )}

      {themeId === "redead" && (
        <>
          <Particles kind="dust" />
          <div className="fx-vignette fx-vignette--warm" aria-hidden />
        </>
      )}

      {themeId === "gta6" && <GtaHud />}

      {(themeId === "silenthill" || themeId === "redead" || themeId === "thelastofus") && (
        <div className={`fx-grain fx-grain--${themeId}`} aria-hidden />
      )}

      {intro && intro === themeId && <Intro key={intro} theme={intro} />}
    </>
  );
}
