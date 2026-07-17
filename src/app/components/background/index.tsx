"use client";
import { useTheme } from "./../../../context/tema";
import { THEMES } from "./../../../constantes";

export default function BackgroundVideo() {
  const { themeId } = useTheme();

  const activeTheme = themeId ? THEMES[themeId as keyof typeof THEMES] : null;
  
  // Si no hay tema activo, usa tu fondo por defecto
  const videoSrc = activeTheme?.video || "/fondos_img/Video_Normal.mp4"; 

  return (
    <video 
      key={videoSrc} 
      autoPlay 
      loop 
      muted 
      playsInline 
      className="global-bg-video"
    >
      <source src={videoSrc} type="video/mp4" />
    </video>
  );
}