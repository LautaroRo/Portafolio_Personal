"use client";
import "./estilos.css";

export default function NavBar() {
  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="top-row">
          <div className="logo">LAUTARO</div>
          <a href="#contacto" className="btn-cta">Nuevo Projecto</a>
        </div>

        <div className="nav-links">
          <a href="#info">Información</a>
          <a href="#habilidades">Habilidades</a>
          <a href="#proyectos">Proyectos</a>
          <a href="#contacto">Contacto</a>
        </div>
      </div>
    </nav>
  );
}
