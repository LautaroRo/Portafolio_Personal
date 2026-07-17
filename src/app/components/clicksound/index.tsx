"use client";
import { useEffect } from "react";
import { useTheme } from "./../../../context/tema";
import { THEMES } from "./../../../constantes";

export default function ClickSoundProvider({ children }: { children: React.ReactNode }) {
  const { themeId } = useTheme();

  useEffect(() => {
    const handleGlobalClick = () => {
      const activeTheme = themeId ? THEMES[themeId as keyof typeof THEMES] : null;
      if (activeTheme?.clickSound) {
        const audio = new Audio(activeTheme.clickSound);
        audio.play().catch(() => {});
      }
    };

    // Escuchamos el evento click en todo el documento
    window.addEventListener("click", handleGlobalClick);

    return () => {
      window.removeEventListener("click", handleGlobalClick);
    };
  }, [themeId]);

  return <>{children}</>;
}