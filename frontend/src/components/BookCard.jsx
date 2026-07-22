export default function BookCard({ libro, onBuy }) {
  const esVendido = libro.estado === "Vendido";
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
        {libro.estado === "Disponible" ? (
          <button className="btn-comprar" onClick={() => onBuy(libro)}>
            Comprar
          </button>
        ) : (
          <button className="btn-comprar" disabled>
            {libro.estado}
          </button>
        )}
      </div>
    </div>
  );
}
