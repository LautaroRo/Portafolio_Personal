"use client";

import { FormEvent, useState } from "react";
import { Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Reveal from "../reveal";
import "./estilos.css";

const WHATSAPP = "5493513413701";
// Se configura en Vercel con NEXT_PUBLIC_FORMSPREE_ID. Sin él, el formulario abre WhatsApp con el mensaje armado.
const FORMSPREE_ID = process.env.NEXT_PUBLIC_FORMSPREE_ID;

type Estado = "idle" | "sending" | "sent" | "error";

export default function Contacto() {
  const [estado, setEstado] = useState<Estado>("idle");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);

    if (!FORMSPREE_ID) {
      const texto = `Hola Lautaro, soy ${data.get("name")} (${data.get("email")}).\n\n${data.get("message")}`;
      window.open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
      form.reset();
      setEstado("sent");
      return;
    }

    setEstado("sending");
    try {
      const res = await fetch(`https://formspree.io/f/${FORMSPREE_ID}`, {
        method: "POST",
        body: data,
        headers: { Accept: "application/json" },
      });
      if (!res.ok) throw new Error(String(res.status));
      form.reset();
      setEstado("sent");
    } catch {
      setEstado("error");
    }
  }

  return (
    <section id="contacto" className="contacto-section">
      <Reveal as="h2" className="section-title">
        ¡Hablemos de tu proyecto!
      </Reveal>

      <Reveal delay={100}>
        {estado === "sent" ? (
          <div className="form-success" role="status">
            <CheckCircle2 size={56} className="success-icon" />
            <h3>¡Mensaje {FORMSPREE_ID ? "enviado" : "listo"}!</h3>
            <p>
              {FORMSPREE_ID
                ? "Gracias por escribirme, te respondo a la brevedad."
                : "Se abrió WhatsApp con tu mensaje, solo falta enviarlo."}
            </p>
            <button type="button" className="btn-enviar" onClick={() => setEstado("idle")}>
              Escribir otro mensaje
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="contact-form">
            <div className="field">
              <input type="text" id="name" name="name" placeholder=" " required autoComplete="name" />
              <label htmlFor="name">Nombre</label>
            </div>

            <div className="field">
              <input type="email" id="email" name="email" placeholder=" " required autoComplete="email" />
              <label htmlFor="email">Email</label>
            </div>

            <div className="field">
              <textarea id="message" name="message" placeholder=" " rows={5} required />
              <label htmlFor="message">Contame sobre tu idea...</label>
            </div>

            {estado === "error" && (
              <p className="form-error" role="alert">
                <AlertCircle size={16} /> No se pudo enviar. Probá de nuevo o escribime por WhatsApp.
              </p>
            )}

            <button type="submit" className="btn-enviar" disabled={estado === "sending"}>
              {estado === "sending" ? (
                <>
                  <Loader2 size={18} className="spin" /> Enviando...
                </>
              ) : (
                <>
                  Enviar mensaje <Send size={16} className="send-icon" />
                </>
              )}
            </button>
          </form>
        )}
      </Reveal>

      <Reveal className="whatsapp-container" delay={200}>
        <p>¿Preferís hablar directamente por WhatsApp?</p>
        <a href={`https://wa.me/${WHATSAPP}`} target="_blank" rel="noopener noreferrer" className="btn-whatsapp">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M17.47 14.38c-.3-.15-1.75-.86-2.02-.96-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.64.07-.3-.15-1.25-.46-2.38-1.47-.88-.78-1.47-1.75-1.64-2.05-.17-.3-.02-.46.13-.6.13-.14.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.6-.92-2.2-.24-.58-.49-.5-.67-.5h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.48 0 1.47 1.07 2.88 1.21 3.08.15.2 2.1 3.2 5.08 4.49.71.3 1.27.49 1.7.63.72.23 1.37.2 1.88.12.57-.09 1.75-.72 2-1.41.25-.7.25-1.29.17-1.41-.07-.13-.27-.2-.57-.35zM12.05 21.8h-.01a9.8 9.8 0 0 1-5-1.37l-.36-.21-3.72.97 1-3.62-.24-.37a9.8 9.8 0 0 1-1.5-5.22c0-5.42 4.42-9.83 9.84-9.83 2.63 0 5.1 1.02 6.95 2.88a9.77 9.77 0 0 1 2.88 6.96c0 5.42-4.42 9.82-9.84 9.82zm8.37-18.2A11.76 11.76 0 0 0 12.05.13C5.5.13.17 5.46.17 12.01c0 2.1.55 4.14 1.6 5.94L.07 24l6.2-1.62a11.84 11.84 0 0 0 5.77 1.47h.01c6.55 0 11.88-5.33 11.88-11.88 0-3.17-1.24-6.16-3.5-8.4z" />
          </svg>
          Chatear por WhatsApp
        </a>
      </Reveal>
    </section>
  );
}
