"use client";

import { useTextos } from "../../../context/tema";
import "./estilos.css";

export default function NavBar() {
  const t = useTextos();

  const links = [
    { href: "#info", label: t["nav.info"] },
    { href: "#habilidades", label: t["nav.skills"] },
    { href: "#proyectos", label: t["nav.projects"] },
    { href: "#contacto", label: t["nav.contact"] },
  ];

  return (
    <nav className="navbar" aria-label="Principal">
      <div className="nav-container">
        <div className="top-row">
          <a href="#info" className="logo" aria-label="Ir al inicio">
            {"LAUTARO".split("").map((letra, i) => (
              <span key={i} style={{ animationDelay: `${i * 60}ms` }}>
                {letra}
              </span>
            ))}
          </a>
          <a href="#contacto" className="btn-cta">
            {t.cta}
          </a>
        </div>

        <div className="nav-links">
          {links.map((link, i) => (
            <a key={link.href} href={link.href} style={{ animationDelay: `${300 + i * 80}ms` }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
