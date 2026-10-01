"use client";

import Image from "next/image";
import { MouseEvent } from "react";
import { Globe, Lock } from "lucide-react";
import Reveal from "../reveal";
import { useTextos } from "../../../context/tema";
import "./estilos.css";

type Proyecto = {
  nombre: string;
  desc: string;
  tags: string[];
  imagen: string;
  linkWeb: string;
  linkGit: string | null;
};

const PROYECTOS: Proyecto[] = [
  {
    nombre: "Screenly",
    desc: "Plataforma para explorar películas, series y videojuegos: catálogo de cientos de miles de títulos, búsqueda, filtros, tierlist y sitio en 9 idiomas.",
    tags: ["Next.js", "Express", "TypeScript", "MySQL", "TiDB", "Vercel"],
    imagen: "/proyectos/screenly.png",
    linkWeb: "https://screenly-web.vercel.app",
    linkGit: null, // repo privado
  },
  {
    nombre: "Gestor de Turnos Peluquería",
    desc: "Sistema integral para la gestión de turnos de barbería.",
    tags: ["Next.js", "Mongoose", "Node.js", "MongoDB", "TypeScript"],
    imagen: "/proyectos/peluqueria-one.png",
    linkWeb: "https://peluqueria-one-weld.vercel.app/",
    linkGit: "https://github.com/LautaroRo/Peluqueria-ONE",
  },
];

// Inclina la tarjeta hacia el mouse y mueve el brillo con él.
const onMove = (e: MouseEvent<HTMLElement>) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = (e.clientX - rect.left) / rect.width;
  const y = (e.clientY - rect.top) / rect.height;
  card.style.setProperty("--mx", `${x * 100}%`);
  card.style.setProperty("--my", `${y * 100}%`);
  card.style.setProperty("--rx", `${(0.5 - y) * 8}deg`);
  card.style.setProperty("--ry", `${(x - 0.5) * 8}deg`);
};

const onLeave = (e: MouseEvent<HTMLElement>) => {
  e.currentTarget.style.setProperty("--rx", "0deg");
  e.currentTarget.style.setProperty("--ry", "0deg");
};

const GitHubIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

export default function Proyectos() {
  const t = useTextos();

  return (
    <section id="proyectos" className="proyectos-container">
      <Reveal as="h2" className="section-title">
        {t["projects.title"]}
      </Reveal>

      <div className="proyectos-wrapper">
        <div className="bento-grid">
          {PROYECTOS.map((p, i) => (
            <Reveal key={p.nombre} delay={i * 120} className="card-reveal">
              <article className="project-card" onMouseMove={onMove} onMouseLeave={onLeave}>
                <a href={p.linkWeb} target="_blank" rel="noopener noreferrer" className="project-image" tabIndex={-1}>
                  <Image
                    src={p.imagen}
                    alt={`Captura de ${p.nombre}`}
                    fill
                    sizes="(max-width: 768px) 90vw, 480px"
                    priority={i === 0}
                  />
                </a>

                <div className="card-content">
                  <h3>{p.nombre}</h3>
                  <p className="description">{p.desc}</p>
                  <div className="tags-container">
                    {p.tags.map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="project-actions">
                    <a href={p.linkWeb} target="_blank" rel="noopener noreferrer" className="btn-action">
                      <Globe size={17} /> {t["projects.web"]}
                    </a>

                    {p.linkGit ? (
                      <a href={p.linkGit} target="_blank" rel="noopener noreferrer" className="btn-action">
                        <GitHubIcon /> GitHub
                      </a>
                    ) : (
                      <span className="btn-action btn-action--muted" title="El código de este proyecto es privado">
                        <Lock size={16} /> {t["projects.private"]}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            </Reveal>
          ))}

          <Reveal delay={PROYECTOS.length * 120} className="card-reveal">
            <article className="project-card locked">
              <div className="lock-icon" aria-hidden>
                ?
              </div>
              <div className="card-content">
                <h3>???</h3>
                <p className="description">{t["projects.locked"]}</p>
                <div className="tags-container">
                  <span className="tag">{t["projects.soon"]}</span>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
