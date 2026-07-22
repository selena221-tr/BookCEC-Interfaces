import { useState, useEffect } from "react";

export default function ModalEditarUsuario({ usuario, onSave, onDelete, onClose }) {
  const [nombre, setNombre] = useState("");
  const [rol, setRol] = useState("usuario");
  const [estado, setEstado] = useState("activo");

  useEffect(() => {
    if (usuario) {
      setNombre(usuario.nombre || "");
      setRol(usuario.rol || "usuario");
      setEstado(usuario.estado || "activo");
    }
  }, [usuario]);

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre.trim()) return;
    await onSave(usuario.firestoreId, { nombre, rol, estado });
    onClose();
  }

  async function handleDelete() {
    const confirmar = window.confirm(
      `¿Estás seguro de eliminar al usuario "${usuario.nombre}"? Esta acción no se puede deshacer.`
    );
    if (!confirmar) return;
    await onDelete(usuario.firestoreId);
    onClose();
  }

  if (!usuario) return null;

  const fechaRegistro = usuario.createdAt
    ? new Date(usuario.createdAt).toLocaleDateString("es-EC")
    : "N/A";

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-dialog modal-dialog-centered"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Editar Usuario</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>

          <div className="modal-body">
            <form id="formEditarUsuario" onSubmit={handleSubmit}>
              <div className="mb-3 text-center">
                <div className="usuario-avatar-modal">
                  <i className="bi bi-person-circle"></i>
                </div>
                <small className="text-muted">{usuario.email}</small>
                <br />
                <small className="text-muted">
                  Registrado: {fechaRegistro}
                </small>
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre completo</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre del usuario"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Rol</label>
                  <select
                    className="form-select"
                    value={rol}
                    onChange={(e) => setRol(e.target.value)}
                    required
                  >
                    <option value="usuario">Usuario</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Estado</label>
                  <select
                    className="form-select"
                    value={estado}
                    onChange={(e) => setEstado(e.target.value)}
                    required
                  >
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          <div className="modal-footer">
            <button
              type="button"
              className="btn-eliminar-usuario"
              onClick={handleDelete}
            >
              <i className="bi bi-trash-fill"></i> Eliminar
            </button>
            <div className="modal-footer-right">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onClose}
              >
                Cancelar
              </button>
              <button
                type="submit"
                form="formEditarUsuario"
                className="btn-publicar"
              >
                <i className="bi bi-check-lg"></i> Guardar cambios
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
