/* =========================================================
   marketplace.js - BookCEC
   Pinta las tarjetas del marketplace a partir de los datos
   de book-store.js (compartidos con el dashboard) y maneja
   la búsqueda, los filtros y la compra de libros.
   ========================================================= */

let libros = []; // Almacena los libros disponibles

document.addEventListener("DOMContentLoaded", () => {
    libros = obtenerLibros(); // Carga los libros desde el almacenamiento

    renderGrid(libros); // Muestra las tarjetas
    setupFiltrosMarket(); // Activa los filtros
    setupCompraMarket(); // Activa la compra de libros
});

function renderGrid(data) {
    const grid = document.getElementById("marketGrid"); // Obtiene el contenedor
    if (!grid) return; // Verifica que exista

    // FILTRO ADICIONADO: Oculta los libros cuyo estado sea "Pendiente"
    const librosVisibles = data.filter(libro => libro.estado !== "Pendiente");

    if (librosVisibles.length === 0) {
        grid.innerHTML = `<p class="text-center">No se encontraron libros con esos criterios.</p>`; // Mensaje sin resultados
        return;
    }

    grid.innerHTML = librosVisibles.map(libro => `
        <div class="market-card">
            <img src="${libro.imagen || 'imagenes/libro1.png'}" alt="${libro.nombre}"> <!-- Imagen del libro -->
            <div class="market-info">
                <h3>${libro.nombre}</h3>
                <p><strong>Nivel:</strong> ${libro.nivel}</p>
                <p><strong>Condición:</strong> ${libro.condicion}</p>
                <p class="price">$${libro.precio}</p>
                ${botonMarket(libro)} <!-- Genera el botón correspondiente -->
            </div>
        </div>
    `).join(""); // Une todas las tarjetas
}

function botonMarket(libro) {
    if (libro.estado === "Disponible") { // Verifica disponibilidad
        return `<button class="btn-comprar" data-comprar="${libro.id}">Comprar</button>`;
    }
    return `<button class="btn-comprar" disabled>Vendido</button>`; // Desactiva si ya fue vendido
}

/* ---------- 2. COMPRA DE LIBROS (desde el marketplace) ---------- */

function setupCompraMarket() {
    const grid = document.getElementById("marketGrid"); // Obtiene el contenedor
    if (!grid) return; // Verifica que exista

    // Delegación de eventos: las tarjetas se regeneran, así que
    // escuchamos los clics desde el contenedor, no cada botón.
    grid.addEventListener("click", (e) => {
        const boton = e.target.closest("[data-comprar]"); // Busca el botón presionado
        if (!boton) return; // Sale si no fue un botón de compra

        const id = Number(boton.dataset.comprar); // Obtiene el id del libro
        comprarLibroMarket(id); // Procesa la compra
    });
}

function comprarLibroMarket(id) {
    const actualizado = comprarLibroStore(id); // Cambia el estado del libro
    if (!actualizado) return; // Verifica que la compra sea válida

    libros = obtenerLibros(); // Recarga la lista actualizada
    alert(`¡Compraste "${actualizado.nombre}"! Ya aparece como vendido.`); // Muestra confirmación
    aplicarFiltrosMarket(); // Actualiza las tarjetas
}

/* ---------- 3. BÚSQUEDA Y FILTROS ---------- */

function setupFiltrosMarket() {
    const busqueda = document.getElementById("buscarLibroMarket"); // Campo de búsqueda
    const nivel = document.getElementById("filtroNivelMarket"); // Filtro por nivel
    const condicion = document.getElementById("filtroCondicionMarket"); // Filtro por condición
    const precio = document.getElementById("filtroPrecioMarket"); // Filtro por precio
    const btnFiltrar = document.getElementById("btnFiltrar"); // Botón filtrar

    if (busqueda) busqueda.addEventListener("input", aplicarFiltrosMarket); // Escucha la búsqueda
    if (nivel) nivel.addEventListener("change", aplicarFiltrosMarket); // Escucha el nivel
    if (condicion) condicion.addEventListener("change", aplicarFiltrosMarket); // Escucha la condición
    if (precio) precio.addEventListener("change", aplicarFiltrosMarket); // Escucha el precio
    if (btnFiltrar) btnFiltrar.addEventListener("click", aplicarFiltrosMarket); // Filtra al hacer clic
}

function aplicarFiltrosMarket() {
    const texto = (document.getElementById("buscarLibroMarket")?.value || "").toLowerCase().trim(); // Texto buscado
    const nivel = document.getElementById("filtroNivelMarket")?.value || ""; // Nivel seleccionado
    const condicion = document.getElementById("filtroCondicionMarket")?.value || ""; // Condición seleccionada
    const rangoPrecio = document.getElementById("filtroPrecioMarket")?.value || ""; // Rango de precio

    const filtrados = libros.filter(libro => {
        const coincideTexto = libro.nombre.toLowerCase().includes(texto); // Filtra por nombre
        const coincideNivel = !nivel || libro.nivel === nivel; // Filtra por nivel
        const coincideCondicion = !condicion || libro.condicion.toLowerCase() === condicion.toLowerCase(); // Filtra por condición
        const coincidePrecio = !rangoPrecio || dentroDeRango(libro.precio, rangoPrecio); // Filtra por precio
        return coincideTexto && coincideNivel && coincideCondicion && coincidePrecio; // Combina todos los filtros
    });

    renderGrid(filtrados); // Muestra los resultados
}

function dentroDeRango(precio, rango) {
    const [min, max] = rango.split("-").map(Number); // Obtiene el mínimo y máximo
    return precio >= min && precio <= max; // Verifica si el precio está dentro del rango
}