"use client";

import { CSSProperties, ElementType, ReactNode, useEffect, useRef } from "react";

type Variant = "up" | "left" | "right" | "zoom";

type RevealProps = {
  children: ReactNode;
  as?: ElementType;
  variant?: Variant;
  delay?: number;
  className?: string;
};

// Un solo IntersectionObserver para toda la página: cada elemento se anima una vez al entrar.
let observer: IntersectionObserver | null = null;

const getObserver = () => {
  observer ??= new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer?.unobserve(entry.target);
        }
      }
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
  );
  return observer;
};

export default function Reveal({ children, as: Tag = "div", variant = "up", delay = 0, className = "" }: RevealProps) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = getObserver();
    obs.observe(el);
    return () => obs.unobserve(el);
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal reveal--${variant} ${className}`}
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {children}
    </Tag>
  );
}
