import Navbar from "./components/navbar";
import Info from "./components/info";
import NavGuia from "./components/navguia";
import Habilidades from "./components/habilidades";
import Proyectos from "./components/proyectos";
import Contacto from "./components/contacto";
import Switch from "../context/switch";

export default function MainPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <Info />
      <NavGuia />
      <Habilidades />
      <Proyectos />
      <Contacto />
      <Switch />
    </main>
  );
}
