import { useState } from "react";
import { Link } from "react-router-dom";

export default function Landing() {
  const categorias = ["Principiante", "Básico", "Intermedio", "Avanzado", "Académico"];

  const librosDestacados = [
    { id: 1, nombre: "Intercambio 5.ª edición", condicion: "Nuevo", precio: 10, imagen: "/imagenes/libro4.png" },
    { id: 2, nombre: "Intercambio 5.ª edición", condicion: "Nuevo", precio: 25, imagen: "/imagenes/libro3.png" },
    { id: 3, nombre: "Intercambio 5.ª edición", condicion: "Nuevo", precio: 20, imagen: "/imagenes/libro2.png" },
  ];

  return (
    <main className="principal">
      {/* CAROUSEL */}
      <div id="carouselExampleRide" className="carousel slide" data-bs-ride="carousel">
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
            <button key={cat}>{cat}</button>
          ))}
        </div>
        <div className="final">
          <img src="/imagenes/linea.png" alt="linea" />
        </div>
      </section>

      {/* LIBROS DESTACADOS */}
      <section className="libros-destacados">
        <h2>Libros Destacados</h2>
        <div className="contenedor-libros">
          {librosDestacados.map((libro) => (
            <div className="tarjeta" key={libro.id}>
              <div className="imagen">
                <img src={libro.imagen} alt="libros" />
              </div>
              <div className="texto">
                <h3>{libro.nombre}</h3>
                <p>
                  Condición: {libro.condicion} <br /> Precio: ${libro.precio}
                </p>
                <button>Comprar</button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SERVICIOS */}
      <section className="servicios" id="servicios">
        <h2>Servicios</h2>
        <div className="contenedor-servicios">
          <div className="servicio-card">
            <h3>Compra de libros</h3>
            <p>Encuentra libros usados de inglés por nivel y a precios accesibles.</p>
            <img src="/imagenes/servicio1.avif" alt="Servicio 1" />
          </div>
          <div className="servicio-card">
            <h3>Venta de libros</h3>
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
