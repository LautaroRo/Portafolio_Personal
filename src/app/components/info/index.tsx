import "./estilos.css";

export default function Info() {
  return (
    <section id="info" className="info-section">
      <div className="info-content">
        {/* Asegúrate de tener tu foto como public/perfil.jpg */}
        <img src="/perfil.jpg" alt="Lautaro" className="profile-img" />
        <h1>Hola, soy Lautaro.</h1>
        <p>
          Estudiante de Ingeniería en Software en la Universidad Siglo 21. 
          Tengo 22 años y una verdadera pasión por la programación. 
          Me destaco por mi alta adaptabilidad y sólidas soft skills 
          para el trabajo en equipo.
        </p>
      </div>
    </section>
  );
}