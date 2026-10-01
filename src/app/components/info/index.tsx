import Typewriter from "./typewriter";
import "./estilos.css";

export default function Info() {
  return (
    <section id="info" className="info-section">
      <div className="info-content">
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
        </h1>

        <p className="hero-role">
          Desarrollo web con <Typewriter />
        </p>

        <p className="hero-bio">
          Estudiante de Ingeniería en Software en la Universidad Siglo 21. Tengo 22 años y una verdadera pasión por la
          programación. Me destaco por mi alta adaptabilidad y sólidas soft skills para el trabajo en equipo.
        </p>

        <div className="hero-actions">
          <a href="#proyectos" className="hero-btn hero-btn--primary">
            Ver proyectos
          </a>
          <a href="#contacto" className="hero-btn">
            Contactame
          </a>
        </div>
      </div>

      <a href="#habilidades" className="scroll-cue" aria-label="Bajar a habilidades">
        <span />
      </a>
    </section>
  );
}
