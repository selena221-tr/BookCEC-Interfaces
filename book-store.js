/* =========================================================
   book-store.js - BookCEC
   Fuente de datos ÚNICA y compartida entre Dashboard y
   Marketplace. Usa localStorage para simular una "base de
   datos" mientras no hay backend, así ambas páginas ven los
   mismos libros y el mismo estado (Disponible / Vendido).

   Cuando exista backend real, solo hay que cambiar el
   contenido de estas funciones por fetch() a la API; el resto
   del código (dashboard.js, marketplace.js) no se toca porque
   siempre habla con obtenerLibros() / comprarLibroStore().
   ========================================================= */

const BOOK_STORE_KEY = "bookcec_books"; // Clave del almacenamiento local

/* Datos iniciales (semilla). Solo se usan la primera vez,
   si no hay nada guardado todavía en localStorage. */
const seedBooksData = [
    { id: 1, nombre: "Interchange 5th Edition", nivel: "B1", condicion: "Nuevo", precio: 15, estado: "Disponible", imagen: "imagenes/libro1.png" },
    { id: 2, nombre: "Vocabulary Builder", nivel: "C1", condicion: "Usado", precio: 18, estado: "Disponible", imagen: "imagenes/libro2.png" },
    { id: 3, nombre: "TOEFL Preparation", nivel: "C2", condicion: "Nuevo", precio: 30, estado: "Disponible", imagen: "imagenes/libro3.png" },
    { id: 4, nombre: "English Grammar", nivel: "A2", condicion: "Subrayado", precio: 9, estado: "Disponible", imagen: "imagenes/libro4.png" },
    { id: 5, nombre: "Passages Level 1", nivel: "A1", condicion: "Nuevo", precio: 12, estado: "Disponible", imagen: "imagenes/libro1.png" },
    { id: 6, nombre: "IELTS Practice Tests", nivel: "C1", condicion: "Usado", precio: 22, estado: "Disponible", imagen: "imagenes/libro2.png" },
    { id: 7, nombre: "Basic Grammar in Use", nivel: "A2", condicion: "Nuevo", precio: 14, estado: "Disponible", imagen: "imagenes/libro3.png" },
    { id: 8, nombre: "Reading Explorer 4", nivel: "B2", condicion: "Usado", precio: 16, estado: "Disponible", imagen: "imagenes/libro4.png" },
];

/* ---------- Lectura / escritura en localStorage ---------- */

function cargarLibros() {
    const guardado = localStorage.getItem(BOOK_STORE_KEY); // Lee los libros guardados

    if (guardado) {
        try {
            return JSON.parse(guardado); // Convierte el JSON en objetos
        } catch (e) {
            console.warn("bookcec_books estaba corrupto, se reinicia con los datos base.", e); // Informa del error
        }
    }

    guardarLibros(seedBooksData); // Guarda la lista inicial
    return structuredClone(seedBooksData); // Devuelve una copia de la semilla
}

function guardarLibros(libros) {
    localStorage.setItem(BOOK_STORE_KEY, JSON.stringify(libros)); // Guarda la lista en localStorage
}

/* ---------- API pública que usan dashboard.js y marketplace.js ---------- */

// Devuelve la lista actual de libros (ya sea la guardada o la semilla)
function obtenerLibros() {
    return cargarLibros(); // Obtiene todos los libros
}

// Marca un libro como vendido y persiste el cambio. Devuelve el libro
// actualizado, o null si no existía o ya estaba vendido.
function comprarLibroStore(id) {
    const libros = cargarLibros(); // Obtiene la lista actual
    const libro = libros.find(l => l.id === id); // Busca el libro por id

    if (!libro || libro.estado !== "Disponible") return null; // Solo compra si está disponible

    libro.estado = "Vendido"; // Cambia el estado
    guardarLibros(libros); // Guarda el cambio
    return libro; // Devuelve el libro actualizado
}

// Útil en desarrollo, por si quieren volver a los datos base
function reiniciarLibros() {
    guardarLibros(seedBooksData); // Restaura los datos iniciales
    return structuredClone(seedBooksData); // Devuelve una copia limpia
}

// Agrega un libro nuevo (publicado desde el dashboard) y lo persiste.
// datos = { nombre, nivel, condicion, precio, imagen }
// El id se genera automáticamente y siempre arranca como "Disponible".
function agregarLibro(datos) {
    const libros = cargarLibros(); // Obtiene los libros actuales

    const nuevoId = libros.length > 0
        ? Math.max(...libros.map(l => l.id)) + 1 // Calcula el siguiente id
        : 1; // Primer id disponible

    const libroNuevo = {
        id: nuevoId,
        nombre: datos.nombre,
        nivel: datos.nivel,
        condicion: datos.condicion,
        precio: Number(datos.precio), // Convierte el precio a número
        estado: "Disponible", // Estado inicial
        imagen: datos.imagen || "imagenes/libro1.png" // Imagen por defecto
    };

    libros.push(libroNuevo); // Agrega el nuevo libro
    guardarLibros(libros); // Guarda la lista actualizada
    return libroNuevo; // Devuelve el libro creado
}

// Elimina un libro por id y persiste el cambio.
// Devuelve true si se eliminó, false si no se encontró.
function eliminarLibro(id) {
    const libros = cargarLibros(); // Obtiene los libros
    const nuevaLista = libros.filter(l => l.id !== id); // Excluye el libro

    if (nuevaLista.length === libros.length) return false; // No encontró el libro

    guardarLibros(nuevaLista); // Guarda la nueva lista
    return true; // Eliminación exitosa
}

// Cambia el estado de un libro (ej. de "Vendido" a "Disponible").
// nuevoEstado debe ser "Disponible", "Pendiente" o "Vendido".
// Devuelve el libro actualizado, o null si no existía.
function cambiarEstadoLibro(id, nuevoEstado) {
    const estadosValidos = ["Disponible", "Pendiente", "Vendido"]; // Estados permitidos

    if (!estadosValidos.includes(nuevoEstado)) {
        console.warn(`Estado inválido: "${nuevoEstado}". Usa uno de: ${estadosValidos.join(", ")}`); // Valida el estado
        return null;
    }

    const libros = cargarLibros(); // Obtiene los libros
    const libro = libros.find(l => l.id === id); // Busca el libro

    if (!libro) return null; // Verifica que exista

    libro.estado = nuevoEstado; // Actualiza el estado
    guardarLibros(libros); // Guarda el cambio
    return libro; // Devuelve el libro actualizado
}

// Edita los datos de un libro existente y persiste el cambio.
// datosNuevos = { nombre, nivel, condicion, precio, imagen, estado } - imagen y estado son opcionales
// Si no se sube una imagen nueva, conserva la que ya tenía.
// Si no se envía estado, conserva el que ya tenía.
// Devuelve el libro actualizado, o null si no existía.
function editarLibro(id, datosNuevos) {
    const libros = cargarLibros(); // Obtiene los libros actuales
    const libro = libros.find(l => l.id === id); // Busca el libro por id

    if (!libro) return null; // Verifica que exista

    libro.nombre = datosNuevos.nombre; // Actualiza el nombre
    libro.nivel = datosNuevos.nivel; // Actualiza el nivel
    libro.condicion = datosNuevos.condicion; // Actualiza la condición
    libro.precio = Number(datosNuevos.precio); // Actualiza el precio

    if (datosNuevos.imagen) {
        libro.imagen = datosNuevos.imagen; // Solo cambia la imagen si subieron una nueva
    }

    if (datosNuevos.estado) {
        libro.estado = datosNuevos.estado; // Solo cambia el estado si se envió uno nuevo
    }

    guardarLibros(libros); // Guarda el cambio
    return libro; // Devuelve el libro actualizado
}