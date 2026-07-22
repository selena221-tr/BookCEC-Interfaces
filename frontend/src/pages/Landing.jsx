import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { subscribeToBooks } from "../services/bookService";

const categoriasMap = {
  Principiante: "A1",
  Básico: "A2",
  Intermedio: "B1",
  Avanzado: "B2",
  Académico: "C1",
};

export default function Landing() {
  const categorias = Object.keys(categoriasMap);
  const [librosDestacados, setLibrosDestacados] = useState([]);

  useEffect(() => {
    const unsubscribe = subscribeToBooks((data) => {
      const disponibles = data.filter((l) => l.estado === "Disponible");
      const shuffle = disponibles.sort(() => 0.5 - Math.random());
      setLibrosDestacados(shuffle.slice(0, 6));
    });
    return () => unsubscribe();
  }, []);

  return (
    <main className="principal">
      {/* CAROUSEL */}
      <div id="carouselExampleRide" className="carousel slide" data-bs-ride="carousel" data-bs-interval="5000">
        <div className="carousel-inner">
          <div className="carousel-item active">
            <img src="/imagenes/c3.png" className="d-block w-100" alt="Slide 1" />
            <button className="mi_boton">
              <a href="#categories">Explorar Libros</a>
            </button>
          </div>
          <div className="carousel-item">
            <img src="/imagenes/c2.png" className="d-block w-100" alt="Slide 2" />
            <button className="mi_boton">
              <a href="#categories">Explorar Libros</a>
            </button>
          </div>
          <div className="carousel-item">
            <img src="/imagenes/c1.png" className="d-block w-100" alt="Slide 3" />
            <button className="mi_boton">
              <a href="#categories">Explorar Libros</a>
            </button>
          </div>
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="prev">
          <span className="carousel-control-prev-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Previous</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target="#carouselExampleRide" data-bs-slide="next">
          <span className="carousel-control-next-icon" aria-hidden="true"></span>
          <span className="visually-hidden">Next</span>
        </button>
        <div className="carousel-indicators">
          <button type="button" data-bs-target="#carouselExampleRide" data-bs-slide-to="0" className="active" aria-current="true" aria-label="Slide 1"></button>
          <button type="button" data-bs-target="#carouselExampleRide" data-bs-slide-to="1" aria-label="Slide 2"></button>
          <button type="button" data-bs-target="#carouselExampleRide" data-bs-slide-to="2" aria-label="Slide 3"></button>
        </div>
      </div>

      {/* CATEGORÍAS */}
      <section className="categories" id="categories">
        <div className="part1-categories">
          <img src="/imagenes/linea.png" alt="linea" />
          <h2 id="categorias">Categorías</h2>
          <img src="/imagenes/linea.png" alt="linea" />
        </div>
        <div className="botones">
          {categorias.map((cat) => (
            <Link key={cat} to={`/marketplace?nivel=${categoriasMap[cat]}`}>
              <button>{cat}</button>
            </Link>
          ))}
        </div>
        <div className="final">
          <img src="/imagenes/linea.png" alt="linea" />
        </div>
      </section>

      {/* LIBROS DESTACADOS */}
      <section className="libros-destacados">
        <h2>Libros Destacados</h2>
        {librosDestacados.length === 0 ? (
          <p className="text-center">No hay libros disponibles por el momento.</p>
        ) : (
          <div className="contenedor-libros">
            {librosDestacados.map((libro) => (
              <div className="tarjeta" key={libro.firestoreId}>
                <div className="imagen">
                  <img
                    src={libro.imagen || "/imagenes/libro-placeholder.png"}
                    alt={libro.nombre}
                  />
                </div>
                <div className="texto">
                  <h3>{libro.nombre}</h3>
                  <p>
                    Condición: {libro.condicion} <br /> Precio: ${libro.precio}
                  </p>
                  <Link to="/marketplace">
                    <button>Comprar</button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* SERVICIOS */}
      <section className="servicios" id="servicios">
        <h2>Servicios</h2>
        <div className="contenedor-servicios">
          <div className="servicio-card">
            <h3 className="nowrap">Compra de libros</h3>
            <p>Encuentra libros usados de inglés por nivel y a precios accesibles.</p>
            <img src="/imagenes/servicio1.avif" alt="Servicio 1" />
          </div>
          <div className="servicio-card">
            <h3 className="nowrap">Venta de libros</h3>
            <p>Publica tu libro fácilmente y véndelo a otros estudiantes del CEC.</p>
            <img src="/imagenes/servicio2.webp" alt="Servicio 2" />
          </div>
          <div className="servicio-card">
            <h3>Marketplace organizado</h3>
            <p>Filtra por niveles, precios y condición del libro.</p>
            <img src="/imagenes/servicio3.jpg" alt="Servicio 3" />
          </div>
        </div>
      </section>

      {/* CONTACTO */}
      <section className="contacto" id="contacto">
        <h2>Contáctanos</h2>
        <div className="contenedor-contacto">
          <div className="tarjeta2">
            <iframe
              src="https://maps.google.com/maps?q=CEC%20EPN,%20Quito&t=&z=15&ie=UTF8&iwloc=&output=embed"
              width="100%"
              height="350"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mapa CEC"
            ></iframe>
          </div>
          <div className="tarjeta2">
            <form className="formulario" onSubmit={(e) => e.preventDefault()}>
              <input type="text" placeholder="Juan Perez" required />
              <input type="email" placeholder="juan.perez@epn.edu.ec" required />
              <textarea placeholder="Escriba su requerimiento o sugerencia" rows="5" required></textarea>
              <button type="submit">Enviar</button>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
