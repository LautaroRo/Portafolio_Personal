"use client";

import { useEffect, useRef } from "react";

// Barra fina arriba de todo que muestra cuánto se leyó de la página.
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);
  const levelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      barRef.current?.style.setProperty("--progress", String(ratio));
      // En Minecraft la barra es la de experiencia: el nivel sube a medida que se lee
      if (levelRef.current) levelRef.current.textContent = String(Math.floor(ratio * 30));
    };

    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div ref={barRef} className="scroll-progress" aria-hidden>
      <span className="scroll-progress-fill" />
      <span ref={levelRef} className="scroll-progress-level">
        0
      </span>
    </div>
  );
}
