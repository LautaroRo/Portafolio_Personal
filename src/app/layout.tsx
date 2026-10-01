import type { Metadata, Viewport } from "next";
import { Anton, Geist, Geist_Mono, Pacifico, Rye, Special_Elite } from "next/font/google";
import "./globals.css";
import "./temas/minecraft.css";
import "./temas/silenthill.css";
import "./temas/tlou.css";
import "./temas/redead.css";
import "./temas/gta.css";

import { SoundtrackProvider } from "../context/soundtrack";
import { ThemeProvider } from "../context/tema";
import Radio from "../context/radio";
import BackgroundVideo from "./components/background";
import ClickSoundProvider from "./components/clicksound";
import ScrollProgress from "./components/scrollprogress";
import ThemeFX from "./components/themefx";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
// Solo se descargan cuando un tema las usa: Rye en Red Dead, Special Elite en Silent Hill, Anton y Pacifico en GTA
const rye = Rye({ variable: "--font-rye", weight: "400", subsets: ["latin"], preload: false });
const elite = Special_Elite({ variable: "--font-elite", weight: "400", subsets: ["latin"], preload: false });
const anton = Anton({ variable: "--font-anton", weight: "400", subsets: ["latin"], preload: false });
const pacifico = Pacifico({ variable: "--font-pacifico", weight: "400", subsets: ["latin"], preload: false });

const DESCRIPCION =
  "Portafolio de Lautaro Rodríguez, estudiante de Ingeniería en Software y desarrollador web con Next.js, React, Node.js y TypeScript.";

export const metadata: Metadata = {
  title: "Lautaro Rodríguez | Portafolio",
  description: DESCRIPCION,
  openGraph: {
    title: "Lautaro Rodríguez | Portafolio",
    description: DESCRIPCION,
    type: "website",
    locale: "es_AR",
  },
};

export const viewport: Viewport = {
  themeColor: "#050505",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} ${rye.variable} ${elite.variable} ${anton.variable} ${pacifico.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SoundtrackProvider>
            <ClickSoundProvider>
              <ScrollProgress />
              <BackgroundVideo />
              <ThemeFX />
              {children}
              <Radio />
            </ClickSoundProvider>
          </SoundtrackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
