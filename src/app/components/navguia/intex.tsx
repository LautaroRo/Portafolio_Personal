"use client";
import { useEffect } from "react";
import "./estilos.css";

export default function NavGuia() {
  // Lógica para iluminar la línea según el scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section");
      const navDots = document.querySelectorAll(".line");

      sections.forEach((section) => {
        const rect = section.getBoundingClientRect();
        // Si la sección está en la vista, activamos su línea
        if (rect.top >= -50 && rect.top <= window.innerHeight / 2) {
          navDots.forEach((dot) => dot.classList.remove("active"));
          const activeDot = document.querySelector(`[data-target="#${section.id}"]`);
          activeDot?.classList.add("active");
        }
      });
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lógica para el clic: te lleva directo a la sección
const handleClick = (id: string) => {
    // Si el ID es #info, vamos al tope absoluto
    if (id === "#info") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      // Para las demás secciones, usamos scrollIntoView como antes
      const element = document.querySelector(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="scroll-indicator">
      {/* Al hacer clic, enviamos el ID al que debe ir */}
      <div className="line" data-target="#info" onClick={() => handleClick("#info")}></div>
      <div className="line" data-target="#habilidades" onClick={() => handleClick("#habilidades")}></div>
      <div className="line" data-target="#proyectos" onClick={() => handleClick("#proyectos")}></div>
      <div className="line" data-target="#contacto" onClick={() => handleClick("#contacto")}></div>
    </div>
  );
}