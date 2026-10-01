import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { SoundtrackProvider } from "../context/soundtrack";
import { ThemeProvider } from "../context/tema";
import Radio from "../context/radio";
import BackgroundVideo from "./components/background";
import ClickSoundProvider from "./components/clicksound";
import ScrollProgress from "./components/scrollprogress";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });

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
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <SoundtrackProvider>
            <ClickSoundProvider>
              <ScrollProgress />
              <BackgroundVideo />
              {children}
              <Radio />
            </ClickSoundProvider>
          </SoundtrackProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
