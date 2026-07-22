import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { subscribeToBooks, buyBook } from "../services/bookService";
import { useAuth } from "../context/AuthContext";
import BookCard from "../components/BookCard";

export default function Marketplace() {
  const { currentUser } = useAuth();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const returnTo = searchParams.get("return");
  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterNivel, setFilterNivel] = useState(searchParams.get("nivel") || "");
  const [filterCondicion, setFilterCondicion] = useState("");
  const [filterPrecio, setFilterPrecio] = useState("");

  useEffect(() => {
    const unsubscribe = subscribeToBooks((data) => {
      const visible = data.filter((l) => l.estado !== "Pendiente");
      setBooks(visible);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const result = books.filter((libro) => {
      const matchText = libro.nombre.toLowerCase().includes(searchText.toLowerCase());
      const matchNivel = !filterNivel || libro.nivel === filterNivel;
      const matchCondicion = !filterCondicion || libro.condicion === filterCondicion;
      let matchPrecio = true;
      if (filterPrecio) {
        const [min, max] = filterPrecio.split("-").map(Number);
        matchPrecio = libro.precio >= min && libro.precio <= max;
      }
      return matchText && matchNivel && matchCondicion && matchPrecio;
    });
    setFilteredBooks(result);
  }, [books, searchText, filterNivel, filterCondicion, filterPrecio]);

  async function handleBuy(libro) {
    if (libro.estado !== "Disponible") return;
    if (!currentUser) {
      alert("Debes iniciar sesión para comprar un libro.");
      return;
    }
    if (libro.user_id === currentUser.uid) {
      alert("No puedes comprar tu propio libro.");
      return;
    }
    await buyBook(libro.firestoreId, libro.estado, currentUser.uid, currentUser.displayName || currentUser.email);
    alert(`¡Compraste "${libro.nombre}"! Ya aparece como vendido.`);
    if (returnTo === "dashboard") {
      navigate("/dashboard");
    }
  }

  return (
    <main className="marketplace">
      <section className="market-hero">
        <h1>Marketplace de Libros</h1>
        <p>Encuentra libros usados del CEC según tu nivel y al mejor precio.</p>
        {returnTo === "dashboard" && currentUser && (
          <button
            className="btn-marketplace-back"
            onClick={() => navigate("/dashboard")}
          >
            <i className="bi bi-arrow-left-circle"></i> Volver al Dashboard
          </button>
        )}
      </section>

      <section className="market-filters">
        <input
          type="text"
          placeholder="Buscar libro..."
          className="search-input"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
        />

        <select className="filter-select" value={filterNivel} onChange={(e) => setFilterNivel(e.target.value)}>
          <option value="">Nivel</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
          <option value="C1">C1</option>
          <option value="C2">C2</option>
        </select>

        <select className="filter-select" value={filterCondicion} onChange={(e) => setFilterCondicion(e.target.value)}>
          <option value="">Condición</option>
          <option value="Nuevo">Nuevo</option>
          <option value="Usado">Usado</option>
          <option value="Subrayado">Subrayado</option>
        </select>

        <select className="filter-select" value={filterPrecio} onChange={(e) => setFilterPrecio(e.target.value)}>
          <option value="">Precio</option>
          <option value="0-10">$0 - $10</option>
          <option value="10-20">$10 - $20</option>
          <option value="20-50">$20 - $50</option>
        </select>
      </section>

      <section className="market-grid">
        {filteredBooks.length === 0 ? (
          <p className="text-center">No se encontraron libros con esos criterios.</p>
        ) : (
          filteredBooks.map((libro) => (
            <BookCard key={libro.firestoreId} libro={libro} onBuy={handleBuy} />
          ))
        )}
      </section>
    </main>
  );
}
