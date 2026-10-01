"use client";

import Image from "next/image";
import { Briefcase } from "lucide-react";
import { useTheme } from "../tema";
import { THEMES, THEME_IDS } from "../../constantes";
import "./estilos.css";

export default function Switch() {
  const { themeId, theme, cycleTheme } = useTheme();

  const nextId = THEME_IDS[(themeId ? THEME_IDS.indexOf(themeId) + 1 : 0) % THEME_IDS.length];
  const label = `Cambiar a tema ${THEMES[nextId].name}`;

  return (
    <button type="button" onClick={cycleTheme} className="switch-btn" aria-label={label} title={label}>
      {/* La key reinicia la animación del ícono en cada cambio */}
      <span key={themeId ?? "base"} className="switch-icon">
        {theme?.icon ? (
          <Image src={theme.icon} alt="" width={24} height={24} />
        ) : (
          <Briefcase size={22} />
        )}
      </span>
    </button>
  );
}
