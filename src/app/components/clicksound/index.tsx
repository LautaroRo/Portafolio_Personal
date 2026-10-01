"use client";

import { useEffect } from "react";
import { useTheme } from "../../../context/tema";

export default function ClickSoundProvider({ children }: { children: React.ReactNode }) {
  const { theme } = useTheme();
  const sound = theme?.clickSound;

  useEffect(() => {
    if (!sound) return;

    // Un solo Audio por tema, precargado, en vez de crear uno nuevo en cada clic.
    const audio = new Audio(sound);
    audio.preload = "auto";
    audio.volume = 0.5;

    const handleClick = (e: MouseEvent) => {
      // Solo suena en lo que se puede clickear, no en cualquier parte de la página.
      if (!(e.target as Element | null)?.closest?.("a, button, [role='button'], .line, .skill-item")) return;
      audio.currentTime = 0;
      audio.play().catch(() => {});
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, [sound]);

  return <>{children}</>;
}
