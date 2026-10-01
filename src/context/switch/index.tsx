"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { Briefcase, Check } from "lucide-react";
import { useTheme } from "../tema";
import { THEMES, THEME_IDS } from "../../constantes";
import "./estilos.css";

// Selector de tema: abre un menú con todos los mundos en vez de recorrerlos uno por uno.
export default function Switch() {
  const { themeId, theme, setThemeId } = useTheme();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", onDown);
    window.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("pointerdown", onDown);
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="theme-switch" ref={rootRef}>
      {open && (
        <ul className="theme-menu" role="menu" aria-label="Elegí un mundo">
          {THEME_IDS.map((id, i) => {
            const opcion = THEMES[id];
            const activo = id === themeId || (!themeId && id === "profesional");
            return (
              <li key={id} style={{ animationDelay: `${i * 45}ms` }}>
                <button
                  type="button"
                  role="menuitemradio"
                  aria-checked={activo}
                  className={`theme-option ${activo ? "active" : ""}`}
                  onClick={() => {
                    setThemeId(id);
                    setOpen(false);
                  }}
                >
                  <span className="theme-option-icon">
                    {opcion.icon ? (
                      <Image src={opcion.icon} alt="" width={26} height={26} unoptimized={opcion.icon.endsWith(".svg")} />
                    ) : (
                      <Briefcase size={20} />
                    )}
                  </span>
                  <span className="theme-option-name">{opcion.name}</span>
                  {activo && <Check size={16} className="theme-option-check" />}
                </button>
              </li>
            );
          })}
        </ul>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="switch-btn"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Cambiar de mundo"
        title="Cambiar de mundo"
      >
        {/* La key reinicia la animación del ícono en cada cambio */}
        <span key={themeId ?? "base"} className="switch-icon">
          {theme?.icon ? (
            <Image src={theme.icon} alt="" width={26} height={26} unoptimized={theme.icon.endsWith(".svg")} />
          ) : (
            <Briefcase size={22} />
          )}
        </span>
      </button>
    </div>
  );
}
