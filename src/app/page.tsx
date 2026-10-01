import Navbar from "./components/navbar";
import Info from "./components/info";
import NavGuia from "./components/navguia";
import Habilidades from "./components/habilidades";
import Proyectos from "./components/proyectos";
import Contacto from "./components/contacto";

export default function MainPage() {
  return (
    <main className="page-shell">
      <Navbar />
      <Info />
      <NavGuia />
      <Habilidades />
      <Proyectos />
      <Contacto />
    </main>
  );
}
