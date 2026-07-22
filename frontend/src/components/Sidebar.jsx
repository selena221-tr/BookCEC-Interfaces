import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Sidebar() {
  const { logout, userProfile } = useAuth();
  const isAdmin = userProfile?.rol === "admin";
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <div className="sidebar">
      <div className="logo">
        <h2>
          Book<span>CEC</span>
        </h2>
      </div>

      <NavLink to="/dashboard" className={({ isActive }) => (isActive ? "active-link" : "")}>
        <i className="bi bi-house-door-fill"></i>
        Inicio
      </NavLink>

      <NavLink to="/marketplace">
        <i className="bi bi-book-fill"></i>
        Libros
      </NavLink>

      <a href="#ventas">
        <i className="bi bi-bar-chart-fill"></i>
        Reportes
      </a>

      <a href="#tabla">
        <i className="bi bi-cart-fill"></i>
        Ventas
      </a>

      {isAdmin && (
        <a href="#tabla-usuarios">
          <i className="bi bi-people-fill"></i>
          Usuarios
        </a>
      )}

      <a href="#" onClick={handleLogout}>
        <i className="bi bi-box-arrow-right"></i>
        Cerrar Sesión
      </a>
    </div>
  );
}
