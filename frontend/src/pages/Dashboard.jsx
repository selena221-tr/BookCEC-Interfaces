import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  subscribeToUserBooks,
  subscribeToBooks,
  addBook,
  updateBook,
  deleteBook,
} from "../services/bookService";
import {
  subscribeToUsuarios,
  updateUsuario,
  deleteUsuario,
} from "../services/userService";
import {
  subscribeToPeticionesVendedor,
  aceptarPeticion,
  rechazarPeticion,
} from "../services/peticionesService";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import ModalPublicar from "../components/ModalPublicar";
import ModalEditar from "../components/ModalEditar";
import ModalEditarUsuario from "../components/ModalEditarUsuario";

const NIVELES = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const isAdmin = userProfile?.rol === "admin";

  const [activeTab, setActiveTab] = useState("libros");

  const [books, setBooks] = useState([]);
  const [filteredBooks, setFilteredBooks] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [filterNivel, setFilterNivel] = useState("todos");
  const [filterEstado, setFilterEstado] = useState("todos");
  const [showPublicar, setShowPublicar] = useState(false);
  const [showEditar, setShowEditar] = useState(false);
  const [editingBook, setEditingBook] = useState(null);

  const [usuarios, setUsuarios] = useState([]);
  const [filteredUsuarios, setFilteredUsuarios] = useState([]);
  const [searchUsuario, setSearchUsuario] = useState("");
  const [filterRol, setFilterRol] = useState("todos");
  const [showEditarUsuario, setShowEditarUsuario] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);

  const [peticiones, setPeticiones] = useState([]);

  useEffect(() => {
    if (!currentUser) return;

    const unsubscribeBooks = isAdmin
      ? subscribeToBooks((data) => {
          setBooks(data);
          setFilteredBooks(data);
        })
      : subscribeToUserBooks(currentUser.uid, (data) => {
          setBooks(data);
          setFilteredBooks(data);
        });

    let unsubscribeUsers = null;
    if (isAdmin) {
      unsubscribeUsers = subscribeToUsuarios((data) => {
        setUsuarios(data);
        setFilteredUsuarios(data);
      });
    }

    const unsubscribePeticiones = subscribeToPeticionesVendedor(
      currentUser.uid,
      setPeticiones
    );

    return () => {
      unsubscribeBooks();
      if (unsubscribeUsers) unsubscribeUsers();
      unsubscribePeticiones();
    };
  }, [currentUser, isAdmin]);

  useEffect(() => {
    const result = books.filter((libro) => {
      const matchText = libro.nombre.toLowerCase().includes(searchText.toLowerCase());
      const matchNivel = filterNivel === "todos" || libro.nivel === filterNivel;
      const matchEstado = filterEstado === "todos" || libro.estado === filterEstado;
      return matchText && matchNivel && matchEstado;
    });
    setFilteredBooks(result);
  }, [books, searchText, filterNivel, filterEstado]);

  useEffect(() => {
    const result = usuarios.filter((user) => {
      const matchSearch =
        user.nombre?.toLowerCase().includes(searchUsuario.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchUsuario.toLowerCase());
      const matchRol = filterRol === "todos" || user.rol === filterRol;
      return matchSearch && matchRol;
    });
    setFilteredUsuarios(result);
  }, [usuarios, searchUsuario, filterRol]);

  const totalLibros = books.length;
  const totalVentas = books.filter((l) => l.estado === "Vendido").length;
  const totalIngresos = books
    .filter((l) => l.estado === "Vendido")
    .reduce((sum, l) => sum + l.precio, 0);
  const totalUsuarios = usuarios.length;
  const peticionesPendientes = peticiones.filter((p) => p.estado === "pendiente").length;

  function ventasPorNivel() {
    return NIVELES.map(
      (nivel) => books.filter((l) => l.nivel === nivel && l.estado === "Vendido").length
    );
  }

  async function handlePublicar(bookData) {
    await addBook({ ...bookData, user_id: currentUser.uid });
  }

  async function handleEditar(firestoreId, bookData) {
    await updateBook(firestoreId, bookData);
  }

  function handleEditClick(libro) {
    setEditingBook(libro);
    setShowEditar(true);
  }

  async function handleDeleteBook(firestoreId, nombre) {
    const ok = window.confirm(`¿Eliminar el libro "${nombre}"?`);
    if (ok) await deleteBook(firestoreId);
  }

  async function handleEditarUsuario(firestoreId, data) {
    await updateUsuario(firestoreId, data);
  }

  async function handleDeleteUsuario(firestoreId) {
    await deleteUsuario(firestoreId);
  }

  function handleEditUsuarioClick(usuario) {
    setEditingUsuario(usuario);
    setShowEditarUsuario(true);
  }

  async function handleAceptarPeticion(peticion) {
    const ok = window.confirm(
      `¿Aceptar la solicitud de "${peticion.compradorNombre}" para "${peticion.libroNombre}"? Esto rechazará automáticamente las demás solicitudes pendientes de este libro.`
    );
    if (!ok) return;
    try {
      await aceptarPeticion(peticion);
    } catch (err) {
      alert(err.message);
    }
  }

  async function handleRechazarPeticion(firestoreId) {
    const ok = window.confirm("¿Rechazar esta solicitud?");
    if (ok) await rechazarPeticion(firestoreId);
  }

  function badgeEstado(estado) {
    const clases = {
      Disponible: "bg-success",
      Pendiente: "bg-warning text-dark",
      Vendido: "bg-danger",
    };
    return (
      <span className={`badge ${clases[estado] || "bg-secondary"}`}>
        {estado}
      </span>
    );
  }

  function badgeRol(rol) {
    return rol === "admin" ? (
      <span className="badge bg-success">Admin</span>
    ) : (
      <span className="badge bg-primary">Usuario</span>
    );
  }

  function badgeEstadoUsuario(estado) {
    return estado === "inactivo" ? (
      <span className="badge bg-danger">Inactivo</span>
    ) : (
      <span className="badge bg-success">Activo</span>
    );
  }

  function badgeEstadoPeticion(estado) {
    const clases = {
      pendiente: "bg-warning text-dark",
      aceptada: "bg-success",
      rechazada: "bg-danger",
    };
    return (
      <span className={`badge ${clases[estado] || "bg-secondary"}`}>
        {estado}
      </span>
    );
  }

  function formatDate(dateString) {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("es-EC", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function handleTabChange(tab) {
    setActiveTab(tab);
    setTimeout(() => {
      const targetId =
        tab === "usuarios"
          ? "tabla-usuarios"
          : tab === "peticiones"
          ? "tabla-peticiones"
          : "tabla";
      const el = document.getElementById(targetId);
      if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  }

  return (
    <div>
      <Sidebar onTabChange={handleTabChange} />

      <div className="main-content">
        <Topbar />

        {/* KPI CARDS */}
        <div className="cards-grid">
          <div className="dashboard-card card-1">
            <i className="bi bi-book-half"></i>
            <h2>{totalLibros}</h2>
            <p>Total de Libros</p>
          </div>
          <div className="dashboard-card card-2">
            <i className="bi bi-cart-check-fill"></i>
            <h2>{totalVentas}</h2>
            <p>Ventas Realizadas</p>
          </div>
          <div className="dashboard-card card-4">
            <i className="bi bi-currency-dollar"></i>
            <h2>${totalIngresos}</h2>
            <p>Ingresos Totales</p>
          </div>
          {isAdmin && (
            <div className="dashboard-card card-3">
              <i className="bi bi-people-fill"></i>
              <h2>{totalUsuarios}</h2>
              <p>Usuarios Registrados</p>
            </div>
          )}
        </div>

        {/* GRÁFICO */}
        <div className="chart-section" id="ventas">
          <h4>Ventas por Nivel</h4>
          <DashboardChart data={ventasPorNivel()} />
        </div>

        {/* TABS NAVIGATION */}
        <div className="dashboard-tabs">
          <button
            className={`dashboard-tab ${activeTab === "libros" ? "active" : ""}`}
            onClick={() => setActiveTab("libros")}
          >
            <i className="bi bi-book"></i> Libros
          </button>
          <button
            className={`dashboard-tab ${activeTab === "peticiones" ? "active" : ""}`}
            onClick={() => setActiveTab("peticiones")}
          >
            <i className="bi bi-inbox"></i> Peticiones
            {peticionesPendientes > 0 && (
              <span className="badge bg-danger ms-1">{peticionesPendientes}</span>
            )}
          </button>
          {isAdmin && (
            <button
              className={`dashboard-tab ${activeTab === "usuarios" ? "active" : ""}`}
              onClick={() => setActiveTab("usuarios")}
            >
              <i className="bi bi-people"></i> Gestión de Usuarios
            </button>
          )}
        </div>

        {/* ========== TAB LIBROS ========== */}
        {activeTab === "libros" && (
          <div className="table-section" id="tabla">
            <div className="table-section-header">
              <h4>Libros Publicados</h4>
              <button className="btn-publicar" onClick={() => setShowPublicar(true)}>
                <i className="bi bi-plus-lg"></i> Publicar
              </button>
            </div>

            <div className="row g-2 mb-3 filtros-tabla">
              <div className="col-md-6">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar libro por nombre..."
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                />
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterNivel}
                  onChange={(e) => setFilterNivel(e.target.value)}
                >
                  <option value="todos">Todos los niveles</option>
                  {NIVELES.map((n) => (
                    <option key={n} value={n}>
                      {n}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-3">
                <select
                  className="form-select"
                  value={filterEstado}
                  onChange={(e) => setFilterEstado(e.target.value)}
                >
                  <option value="todos">Todos los estados</option>
                  <option value="Disponible">Disponible</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="Vendido">Vendido</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Libro</th>
                    <th>Nivel</th>
                    <th>Condición</th>
                    <th>Precio</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No se encontraron libros con esos criterios.
                      </td>
                    </tr>
                  ) : (
                    filteredBooks.map((libro) => (
                      <tr
                        key={libro.firestoreId}
                        className="fila-editable"
                        title="Clic para editar"
                        onClick={() => handleEditClick(libro)}
                      >
                        <td>{libro.nombre}</td>
                        <td>{libro.nivel}</td>
                        <td>{libro.condicion}</td>
                        <td>${libro.precio}</td>
                        <td>{badgeEstado(libro.estado)}</td>
                        <td className="text-center">
                          <button
                            className="btn-accion-eliminar"
                            title="Eliminar libro"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteBook(libro.firestoreId, libro.nombre);
                            }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== TAB PETICIONES ========== */}
        {activeTab === "peticiones" && (
          <div className="table-section" id="tabla-peticiones">
            <div className="table-section-header">
              <h4>Solicitudes de Compra</h4>
              <span className="usuarios-count">
                {peticionesPendientes} pendiente{peticionesPendientes !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Libro</th>
                    <th>Comprador</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {peticiones.length === 0 ? (
                    <tr>
                      <td colSpan="5" className="text-center text-muted py-4">
                        No tienes solicitudes de compra todavía.
                      </td>
                    </tr>
                  ) : (
                    peticiones.map((p) => (
                      <tr key={p.firestoreId}>
                        <td>{p.libroNombre}</td>
                        <td>{p.compradorNombre}</td>
                        <td>{formatDate(p.createdAt)}</td>
                        <td>{badgeEstadoPeticion(p.estado)}</td>
                        <td className="text-center">
                          {p.estado === "pendiente" ? (
                            <>
                              <button
                                className="btn-accion-editar"
                                title="Aceptar solicitud"
                                onClick={() => handleAceptarPeticion(p)}
                              >
                                <i className="bi bi-check-circle-fill"></i>
                              </button>
                              <button
                                className="btn-accion-eliminar"
                                title="Rechazar solicitud"
                                onClick={() => handleRechazarPeticion(p.firestoreId)}
                              >
                                <i className="bi bi-x-circle-fill"></i>
                              </button>
                            </>
                          ) : (
                            <span className="text-muted">—</span>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ========== TAB USUARIOS ========== */}
        {activeTab === "usuarios" && (
          <div className="table-section" id="tabla-usuarios">
            <div className="table-section-header">
              <h4>Gestión de Usuarios</h4>
              <span className="usuarios-count">
                {filteredUsuarios.length} de {totalUsuarios} usuarios
              </span>
            </div>

            <div className="row g-2 mb-3 filtros-tabla">
              <div className="col-md-8">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Buscar por nombre o correo..."
                  value={searchUsuario}
                  onChange={(e) => setSearchUsuario(e.target.value)}
                />
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={filterRol}
                  onChange={(e) => setFilterRol(e.target.value)}
                >
                  <option value="todos">Todos los roles</option>
                  <option value="admin">Admin</option>
                  <option value="usuario">Usuario</option>
                </select>
              </div>
            </div>

            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead className="table-success">
                  <tr>
                    <th>Nombre</th>
                    <th>Correo Electrónico</th>
                    <th>Rol</th>
                    <th>Estado</th>
                    <th>Registro</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsuarios.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        No se encontraron usuarios con esos criterios.
                      </td>
                    </tr>
                  ) : (
                    filteredUsuarios.map((user) => (
                      <tr key={user.firestoreId}>
                        <td className="user-name-cell">
                          <i className="bi bi-person-circle user-icon"></i>
                          {user.nombre}
                        </td>
                        <td>{user.email}</td>
                        <td>{badgeRol(user.rol)}</td>
                        <td>{badgeEstadoUsuario(user.estado)}</td>
                        <td>{formatDate(user.createdAt)}</td>
                        <td className="text-center">
                          <button
                            className="btn-accion-editar"
                            title="Editar usuario"
                            onClick={() => handleEditUsuarioClick(user)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                          <button
                            className="btn-accion-eliminar"
                            title="Eliminar usuario"
                            onClick={() => {
                              const ok = window.confirm(
                                `¿Eliminar al usuario "${user.nombre}"?`
                              );
                              if (ok) handleDeleteUsuario(user.firestoreId);
                            }}
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* MODALS */}
      {showPublicar && (
        <ModalPublicar
          onSave={handlePublicar}
          onClose={() => setShowPublicar(false)}
        />
      )}
      {showEditar && editingBook && (
        <ModalEditar
          libro={editingBook}
          onSave={handleEditar}
          onClose={() => {
            setShowEditar(false);
            setEditingBook(null);
          }}
        />
      )}
      {showEditarUsuario && editingUsuario && (
        <ModalEditarUsuario
          usuario={editingUsuario}
          onSave={handleEditarUsuario}
          onDelete={handleDeleteUsuario}
          onClose={() => {
            setShowEditarUsuario(false);
            setEditingUsuario(null);
          }}
        />
      )}
    </div>
  );
}

function DashboardChart({ data }) {
  const canvasRef = useState(null);
  const chartRef = useState(null);

  useEffect(() => {
    let mounted = true;
    let chartInstance = null;

    async function renderChart() {
      const Chart = await import("chart.js/auto");
      if (!mounted || !canvasRef.current) return;

      if (chartRef.current) {
        chartRef.current.destroy();
      }

      chartInstance = new Chart.default(canvasRef.current, {
        type: "bar",
        data: {
          labels: NIVELES,
          datasets: [
            {
              label: "Ventas",
              data: data,
              backgroundColor: "#4a6741",
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: { legend: { display: true } },
          scales: { y: { beginAtZero: true, ticks: { precision: 0 } } },
        },
      });
      chartRef.current = chartInstance;
    }

    renderChart();

    return () => {
      mounted = false;
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [data]);

  return <canvas ref={canvasRef} />;
}