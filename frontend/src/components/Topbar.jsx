import { useState, useRef, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import ModalPerfil from "./ModalPerfil";

export default function Topbar() {
  const { userProfile, currentUser, logout } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showPerfil, setShowPerfil] = useState(false);
  const menuRef = useRef(null);

  const nombre = userProfile?.nombre || currentUser?.displayName || "Usuario";
  const email = currentUser?.email || "";
  const rol = userProfile?.rol || "usuario";

  useEffect(() => {
    function handleClickOutside(e) {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function handleLogout() {
    setShowMenu(false);
    logout();
  }

  function handleEditProfile() {
    setShowMenu(false);
    setShowPerfil(true);
  }

  return (
    <>
      <div className="topbar">
        <div>
          <h3>Dashboard BookCEC</h3>
          <p>Panel administrativo del marketplace</p>
        </div>

        <div className="perfil" ref={menuRef}>
          <div className="perfil-dropdown-container">
            <button className="perfil-trigger" onClick={() => setShowMenu(!showMenu)}>
              <i className="bi bi-person-circle perfil-avatar-icon"></i>
              <div className="perfil-info">
                <strong>{nombre}</strong>
                <small>{rol === "admin" ? "Administrador" : "Usuario"}</small>
              </div>
              <i className={`bi bi-chevron-${showMenu ? "up" : "down"}`}></i>
            </button>

            {showMenu && (
              <div className="perfil-dropdown">
                <div className="dropdown-header">
                  <i className="bi bi-person-circle"></i>
                  <div>
                    <strong>{nombre}</strong>
                    <small>{email}</small>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="dropdown-item" onClick={handleEditProfile}>
                  <i className="bi bi-pencil-square"></i> Editar Perfil
                </button>
                <button className="dropdown-item" onClick={handleLogout}>
                  <i className="bi bi-box-arrow-right"></i> Cerrar Sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {showPerfil && (
        <ModalPerfil onClose={() => setShowPerfil(false)} />
      )}
    </>
  );
}
