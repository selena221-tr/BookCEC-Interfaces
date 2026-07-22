export default function BookCard({ libro, onBuy, currentUser }) {
  const imagenSrc = libro.imagen || "/imagenes/libro1.png";

  return (
    <div className="market-card">
      <img src={imagenSrc} alt={libro.nombre} />
      <div className="market-info">
        <h3>{libro.nombre}</h3>
        <p>
          <strong>Nivel:</strong> {libro.nivel}
        </p>
        <p>
          <strong>Condición:</strong> {libro.condicion}
        </p>
        <p className="price">${libro.precio}</p>

        {libro.estado !== "Disponible" ? (
          <button className="btn-comprar" disabled>
            {libro.estado}
          </button>
        ) : !currentUser ? (
          <button
            className="btn-comprar btn-login-required"
            onClick={() => onBuy(libro)}
          >
            <i className="bi bi-lock-fill"></i> Inicia sesión para comprar
          </button>
        ) : (
          <button className="btn-comprar" onClick={() => onBuy(libro)}>
            Comprar
          </button>
        )}
      </div>
    </div>
  );
}