import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  async function handleLogout() {
    await logout();
    navigate("/login");
  }

  return (
    <header>
      <div className="logo">
        <img src="/imagenes/logo.png" alt="logo" />
        <span>
          <label id="book">Book</label>
        </span>
        <strong>CEC</strong>
      </div>

      <input
        type="checkbox"
        id="menu-toggle"
        checked={menuOpen}
        onChange={() => setMenuOpen(!menuOpen)}
      />

      <label
        htmlFor="menu-toggle"
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </label>

      <nav className={`menu ${menuOpen ? "menu-open" : ""}`}>
        <ul>
          <li>
            <Link to="/" onClick={() => setMenuOpen(false)}>Inicio</Link>
          </li>
          <li>
            <Link to="/nosotros" onClick={() => setMenuOpen(false)}>Nosotros</Link>
          </li>
          <li>
            <a href="/#servicios" onClick={() => setMenuOpen(false)}>Servicios</a>
          </li>
          <li>
            <a href="/#contacto" onClick={() => setMenuOpen(false)}>Contacto</a>
          </li>
          <li>
            <Link to="/marketplace" onClick={() => setMenuOpen(false)}>Marketplace</Link>
          </li>
          {currentUser ? (
            <>
              <li>
                <Link to="/dashboard" onClick={() => setMenuOpen(false)}>Dashboard</Link>
              </li>
              <li>
                <button className="nav-logout-btn" onClick={handleLogout}>
                  Cerrar Sesión
                </button>
              </li>
            </>
          ) : (
            <li>
              <Link to="/login" onClick={() => setMenuOpen(false)}>Login</Link>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}
