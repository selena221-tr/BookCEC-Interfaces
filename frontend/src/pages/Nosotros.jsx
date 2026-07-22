export default function Nosotros() {
  return (
    <main className="nosotros-seccion">
      <div className="nosotros-contenido">
        <div className="nosotros-header">
          <img src="/imagenes/libro.png" alt="Libro" className="libro-img" />
          <h1>Sobre Nosotros</h1>
          <img src="/imagenes/libro.png" alt="Libro" className="libro-img" />
        </div>

        <div className="nosotros-texto">
          <p>
            Bienvenido a <strong>BookCEC</strong>. Somos un proyecto nacido en la{" "}
            <strong>Escuela Politécnica Nacional</strong> con el objetivo de transformar
            la manera en que gestionamos el conocimiento literario.
          </p>
          <p>
            Nuestro enfoque combina la pasión por la lectura con el rigor técnico del{" "}
            <strong>Desarrollo de Software</strong>, buscando siempre soluciones
            creativas a problemas complejos.
          </p>
        </div>

        <div className="valores-caja">
          <h3>Nuestros Pilares</h3>
          <ul>
            <li>📖 <strong>Arquitectura Eficiente:</strong> Desarrollo de soluciones lógicas y escalables.</li>
            <li>🤝 <strong>Trabajo en Equipo:</strong> Colaboración para mejores resultados.</li>
            <li>💬 <strong>Comunicación Asertiva:</strong> Entendemos tus necesidades.</li>
            <li>🛠️ <strong>Resolución de Problemas:</strong> Eficiencia garantizada.</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
