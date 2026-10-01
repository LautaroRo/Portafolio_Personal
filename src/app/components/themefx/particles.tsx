"use client";

import { useEffect, useRef } from "react";

export type ParticleKind = "petals" | "spores" | "dust" | "ash";

type P = { x: number; y: number; vx: number; vy: number; size: number; phase: number; spin: number; color: string };

type Config = {
  density: number; // partículas por cada 10.000 px² de pantalla
  max: number;
  colors: string[];
  size: [number, number];
  speed: [number, number]; // velocidad vertical (negativa = sube)
  drift: number;
  glow: boolean;
  square: boolean;
};

const CONFIG: Record<ParticleKind, Config> = {
  // Pétalos pixelados del bosque de cerezos
  petals: { density: 0.35, max: 70, colors: ["#f7c6d9", "#f29bbf", "#fbe3ec", "#e57fa8"], size: [4, 7], speed: [0.35, 0.8], drift: 0.6, glow: false, square: true },
  // Esporas de cordyceps que flotan hacia arriba
  spores: { density: 0.3, max: 60, colors: ["#e8d98a", "#c9d67a", "#f3e7a8"], size: [1.2, 3], speed: [-0.25, -0.05], drift: 0.25, glow: true, square: false },
  // Polvo dorado al sol del oeste
  dust: { density: 0.35, max: 70, colors: ["#f1d7a6", "#e7c38a", "#fff1d6"], size: [0.8, 2.4], speed: [-0.05, 0.12], drift: 0.35, glow: true, square: false },
  // Ceniza que cae en Silent Hill
  ash: { density: 0.3, max: 60, colors: ["#bdbdbd", "#8f8f8f", "#d9d9d9"], size: [1, 3], speed: [0.15, 0.45], drift: 0.4, glow: false, square: false },
};

const rand = (a: number, b: number) => a + Math.random() * (b - a);

// Un solo canvas con un solo requestAnimationFrame. Se frena con la pestaña oculta.
export default function Particles({ kind }: { kind: ParticleKind }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const cfg = CONFIG[kind];
    let w = 0;
    let h = 0;
    let parts: P[] = [];
    let frame = 0;
    let last = performance.now();

    const spawn = (anywhere: boolean): P => ({
      x: rand(0, w),
      y: anywhere ? rand(0, h) : cfg.speed[0] < 0 ? h + 10 : -10,
      vx: rand(-cfg.drift, cfg.drift),
      vy: rand(cfg.speed[0], cfg.speed[1]),
      size: rand(cfg.size[0], cfg.size[1]),
      phase: rand(0, Math.PI * 2),
      spin: rand(-0.03, 0.03),
      color: cfg.colors[Math.floor(Math.random() * cfg.colors.length)],
    });

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const target = Math.min(cfg.max, Math.round(((w * h) / 10000) * cfg.density));
      parts = parts.slice(0, target);
      while (parts.length < target) parts.push(spawn(true));
    };

    const tick = (now: number) => {
      const dt = Math.min((now - last) / 16.67, 3);
      last = now;
      ctx.clearRect(0, 0, w, h);

      for (const p of parts) {
        p.phase += 0.02 * dt;
        p.x += (p.vx + Math.sin(p.phase) * cfg.drift * 0.5) * dt;
        p.y += p.vy * dt;

        if (p.y > h + 20 || p.y < -20 || p.x < -20 || p.x > w + 20) Object.assign(p, spawn(false));

        ctx.fillStyle = p.color;
        if (cfg.square) {
          // Pétalo pixelado: cuadrado que gira apenas
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(Math.sin(p.phase) * 0.6);
          ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
          ctx.restore();
        } else {
          ctx.globalAlpha = cfg.glow ? 0.45 + Math.sin(p.phase * 2) * 0.35 : 0.7;
          if (cfg.glow) {
            ctx.shadowBlur = p.size * 4;
            ctx.shadowColor = p.color;
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
          ctx.globalAlpha = 1;
        }
      }
      frame = requestAnimationFrame(tick);
    };

    const onVisibility = () => {
      cancelAnimationFrame(frame);
      if (!document.hidden) {
        last = performance.now();
        frame = requestAnimationFrame(tick);
      }
    };

    resize();
    frame = requestAnimationFrame(tick);
    window.addEventListener("resize", resize);
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [kind]);

  return <canvas ref={canvasRef} className={`fx-particles fx-particles--${kind}`} aria-hidden />;
}
