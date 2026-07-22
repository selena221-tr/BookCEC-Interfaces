import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function ModalPerfil({ onClose }) {
  const { currentUser, userProfile, editProfile, changeUserPassword } = useAuth();

  const [tab, setTab] = useState("perfil");
  const [nombre, setNombre] = useState(userProfile?.nombre || currentUser?.displayName || "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [mensaje, setMensaje] = useState({ texto: "", tipo: "" });
  const [loading, setLoading] = useState(false);

  async function handleSaveProfile(e) {
    e.preventDefault();
    if (!nombre.trim()) {
      setMensaje({ texto: "El nombre es obligatorio.", tipo: "error" });
      return;
    }
    try {
      setLoading(true);
      await editProfile(nombre.trim());
      setMensaje({ texto: "Perfil actualizado correctamente.", tipo: "exito" });
    } catch (err) {
      console.error("Error al editar perfil:", err);
      setMensaje({ texto: `Error: ${err.code}`, tipo: "error" });
    } finally {
      setLoading(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setMensaje({ texto: "", tipo: "" });

    if (!currentPassword) {
      setMensaje({ texto: "Ingresa tu contraseña actual.", tipo: "error" });
      return;
    }
    if (!newPassword) {
      setMensaje({ texto: "Ingresa la nueva contraseña.", tipo: "error" });
      return;
    }
    if (newPassword.length < 6) {
      setMensaje({ texto: "La nueva contraseña debe tener al menos 6 caracteres.", tipo: "error" });
      return;
    }
    if (newPassword !== confirmPassword) {
      setMensaje({ texto: "Las contraseñas nuevas no coinciden.", tipo: "error" });
      return;
    }

    try {
      setLoading(true);
      await changeUserPassword(currentPassword, newPassword);
      setMensaje({ texto: "Contraseña actualizada correctamente.", tipo: "exito" });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      console.error("Error al cambiar contraseña:", err);
      if (err.code === "auth/wrong-password" || err.code === "auth/invalid-credential") {
        setMensaje({ texto: "La contraseña actual es incorrecta.", tipo: "error" });
      } else {
        setMensaje({ texto: `Error: ${err.code}`, tipo: "error" });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">

          <div className="modal-header">
            <h5 className="modal-title">Mi Perfil</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>

          <div className="modal-body">
            {/* Tabs internas */}
            <div className="perfil-tabs">
              <button
                className={`perfil-tab ${tab === "perfil" ? "active" : ""}`}
                onClick={() => { setTab("perfil"); setMensaje({ texto: "", tipo: "" }); }}
              >
                <i className="bi bi-person"></i> Editar Perfil
              </button>
              <button
                className={`perfil-tab ${tab === "password" ? "active" : ""}`}
                onClick={() => { setTab("password"); setMensaje({ texto: "", tipo: "" }); }}
              >
                <i className="bi bi-lock"></i> Cambiar Contraseña
              </button>
            </div>

            {/* Tab Perfil */}
            {tab === "perfil" && (
              <form onSubmit={handleSaveProfile} className="perfil-form">
                <div className="perfil-avatar">
                  <i className="bi bi-person-circle"></i>
                  <small className="text-muted">{currentUser?.email}</small>
                </div>

                <div className="mb-3">
                  <label className="form-label">Nombre completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Correo electrónico</label>
                  <input
                    type="email"
                    className="form-control"
                    value={currentUser?.email || ""}
                    disabled
                  />
                  <small className="text-muted">El correo no se puede modificar</small>
                </div>

                {mensaje.texto && (
                  <p className={`mensaje-form ${mensaje.tipo === "exito" ? "exito" : "fallo"}`}>
                    {mensaje.texto}
                  </p>
                )}

                <button type="submit" className="btn-publicar w-100" disabled={loading}>
                  {loading ? "Guardando..." : "Guardar Cambios"}
                </button>
              </form>
            )}

            {/* Tab Contraseña */}
            {tab === "password" && (
              <form onSubmit={handleChangePassword} className="perfil-form">
                <div className="mb-3">
                  <label className="form-label">Contraseña actual</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Ingresa tu contraseña actual"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Nueva contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Mínimo 6 caracteres"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Confirmar nueva contraseña</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Repite la nueva contraseña"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                {mensaje.texto && (
                  <p className={`mensaje-form ${mensaje.tipo === "exito" ? "exito" : "fallo"}`}>
                    {mensaje.texto}
                  </p>
                )}

                <button type="submit" className="btn-publicar w-100" disabled={loading}>
                  {loading ? "Actualizando..." : "Actualizar Contraseña"}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
