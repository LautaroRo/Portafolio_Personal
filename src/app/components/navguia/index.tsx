"use client";

import { useEffect, useState } from "react";
import "./estilos.css";

const SECCIONES = [
  { id: "info", label: "Información" },
  { id: "habilidades", label: "Habilidades" },
  { id: "proyectos", label: "Proyectos" },
  { id: "contacto", label: "Contacto" },
];

export default function NavGuia() {
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
      {SECCIONES.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={`line ${active === id ? "active" : ""}`}
          onClick={() => handleClick(id)}
          aria-label={label}
          aria-current={active === id ? "true" : undefined}
        >
          <span className="line-label">{label}</span>
        </button>
      ))}
    </nav>
  );
}
