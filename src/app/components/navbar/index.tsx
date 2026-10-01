import "./estilos.css";

const LINKS = [
  { href: "#info", label: "Información" },
  { href: "#habilidades", label: "Habilidades" },
  { href: "#proyectos", label: "Proyectos" },
  { href: "#contacto", label: "Contacto" },
];

export default function NavBar() {
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
            Nuevo proyecto
          </a>
        </div>

        <div className="nav-links">
          {LINKS.map((link, i) => (
            <a key={link.href} href={link.href} style={{ animationDelay: `${300 + i * 80}ms` }}>
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  );
}
