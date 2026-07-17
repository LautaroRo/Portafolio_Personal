"use client";

// Usando el alias @/components y quitando la extensión .js/.tsx
import Navbar from "./components/navbar";
import Info from "./components/info";
import NavGuia from "./components/navguia"; 
import Habilidades from "./components/habilidades";
import Proyectos from "./components/proyectos";
import Contacto from "./components/contacto";
import Switch from "./../context/switch";
import Radio from "./../context/radio";

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