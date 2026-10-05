"use client";

import { useEffect, useRef, useState } from "react";

const ORIGEN_YT = "https://www.youtube-nocookie.com";

// Video de YouTube como fondo: sin controles, en silencio y en loop.
// Se reproduce desde YouTube (el canal permite incrustarlo); no se descarga ni se sube al repo.
//
// Se habla con el reproductor por mensajes (la API de iframes de YouTube, sin cargar su script):
// - el video se muestra recién cuando de verdad está reproduciendo, así no se ven el logo,
//   la ruedita de carga ni el cuadro negro del principio;
// - un poco antes del final vuelve al segundo 0: el loop propio de YouTube pasa por un cuadro
//   negro y a veces muestra "más videos";
// - si se corta o falla, se oculta y queda debajo el atardecer dibujado (nunca negro).
export default function YouTubeBackground({ id }: { id: string }) {
  const iframe = useRef<HTMLIFrameElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const enviar = (msg: object) => iframe.current?.contentWindow?.postMessage(JSON.stringify(msg), ORIGEN_YT);
    const comando = (func: string, args: unknown[] = []) => enviar({ event: "command", func, args, id: 1 });
    let duracion = 0;
    let escuchar = 0;

    const onMensaje = (e: MessageEvent) => {
      if (e.origin !== ORIGEN_YT || e.source !== iframe.current?.contentWindow) return;
      let datos: { event?: string; info?: { playerState?: number; currentTime?: number; duration?: number } | number };
      try {
        datos = typeof e.data === "string" ? JSON.parse(e.data) : e.data;
      } catch {
        return;
      }
      window.clearInterval(escuchar); // ya respondió: no hace falta seguir avisando
      const info = typeof datos.info === "object" ? datos.info : undefined;
      const estado = datos.event === "onStateChange" && typeof datos.info === "number" ? datos.info : info?.playerState;

      if (info?.duration) duracion = info.duration;
      // 1 = reproduciendo. 0 = terminó, -1 = sin empezar: ahí se oculta y se ve el atardecer.
      if (estado === 1) setVisible(true);
      if (estado === 0 || estado === -1) {
        setVisible(false);
        if (estado === 0) {
          comando("seekTo", [0, true]);
          comando("playVideo");
        }
      }
      // Loop sin corte: medio segundo antes del final vuelve al principio
      if (duracion && info?.currentTime && info.currentTime > duracion - 0.6) comando("seekTo", [0, true]);
    };

    window.addEventListener("message", onMensaje);
    // El reproductor empieza a mandar su estado cuando se le avisa que alguien escucha
    escuchar = window.setInterval(() => enviar({ event: "listening", id: 1, channel: "widget" }), 500);
    const dejar = window.setTimeout(() => window.clearInterval(escuchar), 10_000);
    return () => {
      window.removeEventListener("message", onMensaje);
      window.clearInterval(escuchar);
      window.clearTimeout(dejar);
    };
  }, []);

  const params = new URLSearchParams({
    autoplay: "1",
    mute: "1",
    controls: "0",
    loop: "1",
    playlist: id, // respaldo por si los mensajes no llegan
    playsinline: "1",
    rel: "0",
    modestbranding: "1",
    iv_load_policy: "3",
    disablekb: "1",
    fs: "0",
    enablejsapi: "1",
  });

  return (
    <div className={`yt-bg ${visible ? "is-ready" : ""}`} aria-hidden>
      <iframe
        ref={iframe}
        src={`${ORIGEN_YT}/embed/${id}?${params}`}
        title="Fondo animado"
        allow="autoplay; encrypted-media; picture-in-picture"
        referrerPolicy="strict-origin-when-cross-origin"
        tabIndex={-1}
      />
    </div>
  );
}
