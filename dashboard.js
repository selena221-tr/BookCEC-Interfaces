const NIVELES = ["A1", "A2", "B1", "B2", "C1", "C2"]; // Niveles para el gráfico

let booksData = [];   // Almacena los libros cargados
let ventasChart;      // Guarda la referencia del gráfico


/* ---------- 1. INICIALIZACIÓN ---------- */

document.addEventListener("DOMContentLoaded", () => {
    booksData = obtenerLibros(); // Carga los libros almacenados

    setupSesion(); // Muestra el usuario activo y habilita "Cerrar Sesión"
    renderCards(); // Actualiza las tarjetas
    renderTabla(booksData); // Muestra la tabla
    renderChart(booksData); // Genera el gráfico
    setupFiltros(); // Activa los filtros
    setupSidebarActivo(); // Activa el menú lateral
    setupPublicar(); // Configura el formulario
    setupEditar(); // Configura la edición de libros
});

function renderCards() {
    const totalLibros = booksData.length; // Cuenta todos los libros
    const ventas = booksData.filter(l => l.estado === "Vendido").length; // Cuenta los vendidos
    const ingresos = booksData
        .filter(l => l.estado === "Vendido") // Filtra los vendidos
        .reduce((sum, l) => sum + l.precio, 0); // Suma los ingresos

    animarContador("cardTotalLibros", totalLibros); // Actualiza la tarjeta
    animarContador("cardVentas", ventas); // Actualiza la tarjeta
    animarContador("cardIngresos", ingresos, "$"); // Actualiza la tarjeta
}

function animarContador(elementId, valorFinal, prefijo = "") {
    const el = document.getElementById(elementId); // Obtiene el elemento
    if (!el) return; // Verifica que exista

    const duracion = 900; // Duración de la animación
    const inicio = performance.now(); // Guarda el tiempo inicial

    function paso(ahora) {
        const progreso = Math.min((ahora - inicio) / duracion, 1); // Calcula el avance
        const valorActual = Math.floor(progreso * valorFinal); // Calcula el valor actual
        el.textContent = prefijo + valorActual; // Actualiza el contador

        if (progreso < 1) {
            requestAnimationFrame(paso); // Continúa la animación
        } else {
            el.textContent = prefijo + valorFinal; // Muestra el valor final
        }
    }

    requestAnimationFrame(paso); // Inicia la animación
}

function renderTabla(data) {
    const tbody = document.getElementById("tablaLibros"); // Obtiene la tabla
    if (!tbody) return; // Verifica que exista

    if (data.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center text-muted py-4">
                    No se encontraron libros con esos criterios.
                </td>
            </tr>`; // Muestra mensaje sin resultados
        return;
    }

    tbody.innerHTML = data.map(libro => `
        <tr class="fila-editable" data-editar="${libro.id}" title="Clic para editar">
            <td>${libro.nombre}</td>
            <td>${libro.nivel}</td>
            <td>${libro.condicion}</td>
            <td>$${libro.precio}</td>
            <td>${badgeEstado(libro.estado)}</td>
        </tr>
    `).join(""); // Genera todas las filas
}

function badgeEstado(estado) {
    const clases = {
        "Disponible": "bg-success",
        "Pendiente": "bg-warning text-dark",
        "Vendido": "bg-danger"
    }; // Colores según el estado

    const clase = clases[estado] || "bg-secondary"; // Asigna una clase
    return `<span class="badge ${clase}">${estado}</span>`; // Devuelve el badge
}


/* ---------- 4. PUBLICAR LIBRO NUEVO (modal) ---------- */

function setupPublicar() {
    const form = document.getElementById("formPublicar"); // Formulario
    const fotoInput = document.getElementById("fotoLibro"); // Selector de imagen
    const preview = document.getElementById("previewFoto"); // Vista previa
    const modalEl = document.getElementById("modalPublicar"); // Modal

    if (!form) return; // Verifica que exista

    let fotoBase64 = ""; // Guarda la imagen en Base64

    // Vista previa de la imagen al elegir un archivo
    fotoInput?.addEventListener("change", () => {
        const archivo = fotoInput.files[0]; // Obtiene el archivo
        if (!archivo) return; // Verifica que exista

        const lector = new FileReader(); // Crea el lector
        lector.onload = (e) => {
            fotoBase64 = e.target.result; // Guarda la imagen
            preview.src = fotoBase64; // Actualiza la vista previa
            preview.classList.remove("d-none"); // Muestra la imagen
        };
        lector.readAsDataURL(archivo); // Convierte el archivo a Base64
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita recargar la página

        const nombre = document.getElementById("nombreLibro").value.trim(); // Nombre del libro
        const nivel = document.getElementById("nivelLibro").value; // Nivel
        const condicion = document.getElementById("condicionLibro").value; // Condición
        const precio = document.getElementById("precioLibro").value; // Precio

        if (!nombre || !nivel || !condicion || !precio) return; // Valida los datos

        agregarLibro({ nombre, nivel, condicion, precio, imagen: fotoBase64 }); // Agrega el libro

        booksData = obtenerLibros(); // Recarga los datos
        renderCards(); // Actualiza las tarjetas
        aplicarFiltros(); // Actualiza la tabla
        actualizarChart(); // Actualiza el gráfico

        form.reset(); // Limpia el formulario
        preview.classList.add("d-none"); // Oculta la vista previa
        fotoBase64 = ""; // Borra la imagen temporal

        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl); // Obtiene el modal
            modal.hide(); // Cierra el modal
        }
    });
}

/* ---------- 5. EDITAR LIBRO EXISTENTE (modal) ---------- */

function setupEditar() {
    const tbody = document.getElementById("tablaLibros"); // Tabla de libros
    const form = document.getElementById("formEditar"); // Formulario de edición
    const fotoInput = document.getElementById("fotoLibroEditar"); // Selector de imagen
    const preview = document.getElementById("previewFotoEditar"); // Vista previa
    const modalEl = document.getElementById("modalEditar"); // Modal

    if (!tbody || !form) return; // Verifica que existan

    let fotoBase64Editar = ""; // Guarda la nueva imagen en Base64 (si se cambia)

    // Detecta el clic en cualquier fila de la tabla (delegación de eventos,
    // porque las filas se regeneran cada vez que se filtra o se agrega un libro)
    tbody.addEventListener("click", (e) => {
        const fila = e.target.closest("[data-editar]"); // Busca la fila presionada
        if (!fila) return; // Sale si no fue una fila editable

        const id = Number(fila.dataset.editar); // Obtiene el id del libro
        const libro = booksData.find(l => l.id === id); // Busca el libro en memoria
        if (!libro) return; // Verifica que exista

        // Rellena el formulario con los datos actuales del libro
        document.getElementById("editarLibroId").value = libro.id;
        document.getElementById("nombreLibroEditar").value = libro.nombre;
        document.getElementById("nivelLibroEditar").value = libro.nivel;
        document.getElementById("condicionLibroEditar").value = libro.condicion;
        document.getElementById("precioLibroEditar").value = libro.precio;
        document.getElementById("estadoLibroEditar").value = libro.estado;

        fotoBase64Editar = ""; // Reinicia la imagen temporal

        if (libro.imagen) {
            preview.src = libro.imagen; // Muestra la imagen actual
            preview.classList.remove("d-none");
        } else {
            preview.classList.add("d-none");
        }

        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl); // Obtiene el modal
            modal.show(); // Abre el modal
        }
    });

    // Vista previa de la imagen nueva (si el usuario elige otra)
    fotoInput?.addEventListener("change", () => {
        const archivo = fotoInput.files[0]; // Obtiene el archivo
        if (!archivo) return; // Verifica que exista

        const lector = new FileReader(); // Crea el lector
        lector.onload = (e) => {
            fotoBase64Editar = e.target.result; // Guarda la nueva imagen
            preview.src = fotoBase64Editar; // Actualiza la vista previa
            preview.classList.remove("d-none"); // Muestra la imagen
        };
        lector.readAsDataURL(archivo); // Convierte el archivo a Base64
    });

    // Guarda los cambios al enviar el formulario
    form.addEventListener("submit", (e) => {
        e.preventDefault(); // Evita recargar la página

        const id = Number(document.getElementById("editarLibroId").value); // Id del libro editado
        const nombre = document.getElementById("nombreLibroEditar").value.trim(); // Nombre
        const nivel = document.getElementById("nivelLibroEditar").value; // Nivel
        const condicion = document.getElementById("condicionLibroEditar").value; // Condición
        const precio = document.getElementById("precioLibroEditar").value; // Precio
        const estado = document.getElementById("estadoLibroEditar").value; // Estado

        if (!nombre || !nivel || !condicion || !precio || !estado) return; // Valida los datos

        editarLibro(id, { nombre, nivel, condicion, precio, estado, imagen: fotoBase64Editar }); // Aplica los cambios

        booksData = obtenerLibros(); // Recarga los datos
        renderCards(); // Actualiza las tarjetas
        aplicarFiltros(); // Actualiza la tabla
        actualizarChart(); // Actualiza el gráfico

        form.reset(); // Limpia el formulario
        preview.classList.add("d-none"); // Oculta la vista previa
        fotoBase64Editar = ""; // Borra la imagen temporal

        if (modalEl) {
            const modal = bootstrap.Modal.getInstance(modalEl) || new bootstrap.Modal(modalEl); // Obtiene el modal
            modal.hide(); // Cierra el modal
        }
    });
}

function setupFiltros() {
    const inputBusqueda = document.getElementById("buscarLibro"); // Campo de búsqueda
    const selectNivel = document.getElementById("filtroNivel"); // Filtro por nivel
    const selectEstado = document.getElementById("filtroEstado"); // Filtro por estado

    if (!inputBusqueda || !selectNivel || !selectEstado) return; // Verifica los elementos

    [inputBusqueda, selectNivel, selectEstado].forEach(el => {
        el.addEventListener("input", aplicarFiltros); // Escucha escritura
        el.addEventListener("change", aplicarFiltros); // Escucha cambios
    });
}

function aplicarFiltros() {
    const texto = (document.getElementById("buscarLibro")?.value || "").toLowerCase().trim(); // Texto buscado
    const nivel = document.getElementById("filtroNivel")?.value || "todos"; // Nivel seleccionado
    const estado = document.getElementById("filtroEstado")?.value || "todos"; // Estado seleccionado

    const filtrados = booksData.filter(libro => {
        const coincideTexto = libro.nombre.toLowerCase().includes(texto); // Filtra por nombre
        const coincideNivel = nivel === "todos" || libro.nivel === nivel; // Filtra por nivel
        const coincideEstado = estado === "todos" || libro.estado === estado; // Filtra por estado
        return coincideTexto && coincideNivel && coincideEstado; // Combina los filtros
    });

    renderTabla(filtrados); // Actualiza la tabla
}

function renderChart(data) {
    const ctx = document.getElementById("ventasChart"); // Obtiene el canvas
    if (!ctx) return; // Verifica que exista

    const ventasPorNivel = calcularVentasPorNivel(data); // Calcula las ventas

    ventasChart = new Chart(ctx, {
        type: "bar", // Tipo de gráfico
        data: {
            labels: NIVELES, // Etiquetas del eje X
            datasets: [{
                label: "Ventas",
                data: ventasPorNivel, // Datos del gráfico
                backgroundColor: "#4a6741",
                borderWidth: 1
            }]
        },
        options: {
            responsive: true, // Ajuste automático
            plugins: {
                legend: {
                    display: true // Muestra la leyenda
                }
            },
            scales: {
                y: {
                    beginAtZero: true, // Inicia desde cero
                    ticks: { precision: 0 } // Solo números enteros
                }
            }
        }
    });
}

function calcularVentasPorNivel(data) {
    return NIVELES.map(nivel =>
        data.filter(l => l.nivel === nivel && l.estado === "Vendido").length // Cuenta ventas por nivel
    );
}

function actualizarChart() {
    if (!ventasChart) return; // Verifica que exista

    ventasChart.data.datasets[0].data = calcularVentasPorNivel(booksData); // Actualiza los datos
    ventasChart.update(); // Redibuja el gráfico
}


/* ---------- 7. SIDEBAR (link activo) ---------- */

function setupSidebarActivo() {
    const links = document.querySelectorAll(".sidebar a"); // Obtiene los enlaces

    links.forEach(link => {
        link.addEventListener("click", (e) => {
            links.forEach(l => l.classList.remove("active-link")); // Quita el enlace activo
            link.classList.add("active-link"); // Activa el enlace seleccionado
        });
    });
}

/* ---------- 8. SESIÓN (usuario activo + cerrar sesión) ---------- */

function setupSesion() {
    const nombreEl = document.getElementById("nombreUsuarioTopbar"); // Elemento del topbar
    const logoutBtn = document.getElementById("btnCerrarSesion"); // Link de cerrar sesión

    const usuarioGuardado = localStorage.getItem("bookcecUsuarioActivo"); // Lee la sesión

    if (usuarioGuardado && nombreEl) {
        try {
            const usuario = JSON.parse(usuarioGuardado); // Convierte el JSON
            nombreEl.textContent = usuario.nombre; // Muestra el nombre real
        } catch (e) {
            console.warn("No se pudo leer el usuario activo.", e); // Informa el error
        }
    }

    logoutBtn?.addEventListener("click", (e) => {
        e.preventDefault(); // Evita navegar al "#"
        localStorage.removeItem("bookcecUsuarioActivo"); // Cierra la sesión
        window.location.href = "sign_in.html"; // Regresa al login
    });
}