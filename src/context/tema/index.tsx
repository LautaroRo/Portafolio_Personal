"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useSyncExternalStore, ReactNode } from "react";
import { THEMES, THEME_IDS, ThemeId, Theme, isThemeId, getTheme } from "../../constantes";
import { getTextos } from "../../constantes/textos";

const STORAGE_KEY = "portafolio-tema";
const CHANGE_EVENT = "portafolio-tema-change";

// El tema vive en localStorage para que sobreviva a una recarga.
// useSyncExternalStore evita el desfase entre el HTML del servidor (sin tema) y el cliente.
const leerTema = (): ThemeId | null => {
  try {
    const value = localStorage.getItem(STORAGE_KEY);
    return isThemeId(value) ? value : null;
  } catch {
    return null;
  }
};

const suscribir = (callback: () => void) => {
  window.addEventListener(CHANGE_EVENT, callback);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(CHANGE_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
};

const guardarTema = (id: ThemeId | null) => {
  try {
    if (id) localStorage.setItem(STORAGE_KEY, id);
    else localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Navegación privada o almacenamiento bloqueado: el tema dura lo que dure la pestaña.
  }
  window.dispatchEvent(new Event(CHANGE_EVENT));
};

type ThemeContextType = {
  themeId: ThemeId | null;
  theme: Theme | null;
  setThemeId: (id: ThemeId | null) => void;
  cycleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType | null>(null);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const themeId = useSyncExternalStore(suscribir, leerTema, () => null);

  const cycleTheme = useCallback(() => {
    const current = leerTema();
    const next = THEME_IDS[(current ? THEME_IDS.indexOf(current) + 1 : 0) % THEME_IDS.length];
    guardarTema(next);
  }, []);

  // Link directo a un mundo: /?tema=silenthill
  useEffect(() => {
    const pedido = new URLSearchParams(window.location.search).get("tema");
    if (isThemeId(pedido)) guardarTema(pedido);
  }, []);

  // La clase en <body> es lo que activa los estilos de cada tema (src/app/temas/).
  useEffect(() => {
    const clase = themeId ? THEMES[themeId].bodyClass : null;
    if (clase) document.body.classList.add(clase);

    // Pulso breve que tapa el cambio de video y tipografía.
    document.body.classList.add("theme-switching");
    const timer = window.setTimeout(() => document.body.classList.remove("theme-switching"), 600);

    return () => {
      if (clase) document.body.classList.remove(clase);
      window.clearTimeout(timer);
    };
  }, [themeId]);

  return (
    <ThemeContext.Provider value={{ themeId, theme: getTheme(themeId), setThemeId: guardarTema, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTextos = () => {
  const { themeId } = useTheme();
  return useMemo(() => getTextos(themeId), [themeId]);
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("useTheme debe usarse dentro de ThemeProvider");
  }

  return context;
};
