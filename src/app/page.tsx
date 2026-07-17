"use client";

// Usando el alias @/components y quitando la extensión .js/.tsx
import Navbar from "./components/navbar/index.tsx";
import Info from "./components/info/index.tsx";
import NavGuia from "./components/navguia/intex.tsx"; // Asegúrate de que el archivo se llame index.tsx/jsx
import Habilidades from "./components/habilidades/index.tsx";
import Proyectos from "./components/proyectos/index.tsx";
import Contacto from "./components/contacto/index.tsx";
import Switch from "./../context/switch/index.tsx";
import Radio from "./../context/radio/index.tsx";

export default function MainPage() {
  return (
    <div className="min-h-screen bg-black/30 text-white w-full">
      <Navbar />
      <Info />
      <NavGuia />
      <Habilidades />
      <Proyectos />
      <Contacto />
      <Switch />
      <Radio />
    </div>
  );
}