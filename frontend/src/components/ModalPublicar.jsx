import { useState } from "react";

const NIVELES = ["A1", "A2", "B1", "B2", "C1", "C2"];

export default function ModalPublicar({ onSave, onClose }) {
  const [nombre, setNombre] = useState("");
  const [nivel, setNivel] = useState("");
  const [condicion, setCondicion] = useState("");
  const [precio, setPrecio] = useState("");
  const [imagen, setImagen] = useState("");
  const [preview, setPreview] = useState("");

  function handleImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImagen(ev.target.result);
      setPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    if (!nombre || !nivel || !condicion || !precio) return;
    await onSave({ nombre, nivel, condicion, precio, imagen });
    setNombre("");
    setNivel("");
    setCondicion("");
    setPrecio("");
    setImagen("");
    setPreview("");
    onClose();
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-dialog modal-dialog-centered" onClick={(e) => e.stopPropagation()}>
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Publicar nuevo libro</h5>
            <button type="button" className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <form id="formPublicar" onSubmit={handleSubmit}>
              <div className="mb-3 text-center">
                {preview && (
                  <img src={preview} alt="Vista previa" className="preview-foto" />
                )}
                <label htmlFor="fotoLibro" className="form-label d-block mt-2">
                  Foto del libro
                </label>
                <input
                  type="file"
                  className="form-control"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Nombre del libro</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Ej. Interchange 5th Edition"
                  value={nombre}
                  onChange={(e) => setNombre(e.target.value)}
                  required
                />
              </div>

              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Nivel</label>
                  <select
                    className="form-select"
                    value={nivel}
                    onChange={(e) => setNivel(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Selecciona...
                    </option>
                    {NIVELES.map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Condición</label>
                  <select
                    className="form-select"
                    value={condicion}
                    onChange={(e) => setCondicion(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Selecciona...
                    </option>
                    <option value="Nuevo">Nuevo</option>
                    <option value="Usado">Usado</option>
                    <option value="Subrayado">Subrayado</option>
                  </select>
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Precio ($)</label>
                <input
                  type="number"
                  className="form-control"
                  min="1"
                  step="0.5"
                  placeholder="Ej. 15"
                  value={precio}
                  onChange={(e) => setPrecio(e.target.value)}
                  required
                />
              </div>
            </form>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" form="formPublicar" className="btn-publicar">
              <i className="bi bi-check-lg"></i> Publicar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
