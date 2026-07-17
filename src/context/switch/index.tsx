"use client";

import { useEffect } from "react";
import Image from "next/image";
import { useTheme } from "./../tema/index";
import { THEMES } from "./../../constantes/index";
import "./estilos.css";

export default function Switch() {
  const { themeId, setThemeId } = useTheme();

  useEffect(() => {
    Object.values(THEMES).forEach((theme) => {
      document.body.classList.remove(theme.bodyClass);
    });

    if (themeId && THEMES[themeId as keyof typeof THEMES]) {
      document.body.classList.add(THEMES[themeId as keyof typeof THEMES].bodyClass);
    }
  }, [themeId]);

const handleToggle = () => {
  setThemeId((prevThemeId: string | null) => {
    const keys = Object.keys(THEMES);
    const currentIndex = prevThemeId ? keys.indexOf(prevThemeId) : -1;

    const nextIndex = (currentIndex + 1) % keys.length;
    const nextTheme = keys[nextIndex];

    console.log("Tema actual:", prevThemeId ?? "ninguno", "-> Siguiente tema:", nextTheme);

    return nextTheme;
  });
};

  const currentTheme = themeId ? THEMES[themeId as keyof typeof THEMES] : null;

  return (
    <button onClick={handleToggle} className="switch-btn">
      {currentTheme?.icon ? (
        <Image 
          src={currentTheme.icon} 
          alt="Icono del tema" 
          width={24} 
          height={24} 
        />
      ) : (
        <span>👔</span>
      )}
    </button>
  );
}