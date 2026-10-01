"use client";

import { useEffect, useState } from "react";
import { useTextos } from "../../../context/tema";
import type { TextoKey } from "../../../constantes/textos";
import "./estilos.css";

const SECCIONES: { id: string; key: TextoKey }[] = [
  { id: "info", key: "nav.info" },
  { id: "habilidades", key: "nav.skills" },
  { id: "proyectos", key: "nav.projects" },
  { id: "contacto", key: "nav.contact" },
];

export default function NavGuia() {
  const t = useTextos();
  const [active, setActive] = useState("info");

  // Marca la sección que cruza la mitad de la pantalla, sin recalcular en cada evento de scroll.
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -45% 0px" },
    );

    for (const { id } of SECCIONES) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }
    return () => observer.disconnect();
  }, []);

  const handleClick = (id: string) => {
    if (id === "info") window.scrollTo({ top: 0, behavior: "smooth" });
    else document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="scroll-indicator" aria-label="Secciones">
      {SECCIONES.map(({ id, key }, i) => (
        // El número solo se ve en el tema Minecraft, como los casilleros de la barra rápida
        <button
          key={id}
          type="button"
          className={`line ${active === id ? "active" : ""}`}
          onClick={() => handleClick(id)}
          aria-label={t[key]}
          aria-current={active === id ? "true" : undefined}
        >
          <span className="line-num" aria-hidden>
            {i + 1}
          </span>
          <span className="line-label">{t[key]}</span>
        </button>
      ))}
    </nav>
  );
}
