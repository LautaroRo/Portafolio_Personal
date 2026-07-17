"use client";

import "./estilos.css";

export default function Contacto() {
  return (
    <section id="contacto" className="contacto-section">
      <h2>¡Hablemos de tu proyecto!</h2>
      
      {/* Reemplazá TU_ID_AQUI por tu URL de Formspree */}
      <form 
        action="https://formspree.io/f/TU_ID_AQUI" 
        method="POST" 
        className="contact-form"
      >
        <label htmlFor="name">Nombre</label>
        <input type="text" id="name" name="name" placeholder="Tu nombre" required />

        <label htmlFor="email">Email</label>
        <input type="email" id="email" name="email" placeholder="tu@email.com" required />

        <label htmlFor="message">Mensaje</label>
        <textarea id="message" name="message" placeholder="Contame sobre tu idea..." required></textarea>
        
        <button type="submit" className="btn-enviar">Enviar Mensaje</button>
      </form>

      <div className="whatsapp-container">
        <p>¿Prefieres hablar directamente por WhatsApp?</p>
        <a 
          href="https://wa.me/5493513413701" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn-whatsapp"
        >
          Chatear por WhatsApp
        </a>
      </div>
    </section>
  );
}