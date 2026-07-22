import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const regexNombre = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]{3,}$/;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!nombre.trim()) {
      setError("El nombre es obligatorio.");
      return;
    }
    if (!regexNombre.test(nombre)) {
      setError("Ingrese un nombre válido (mínimo 3 letras, sin números).");
      return;
    }
    if (!email.trim()) {
      setError("El correo es obligatorio.");
      return;
    }
    if (!regexEmail.test(email)) {
      setError("Ingrese un correo electrónico válido.");
      return;
    }
    if (!password) {
      setError("La contraseña es obligatoria.");
      return;
    }
    if (password.length < 6) {
      setError("Debe tener al menos 6 caracteres.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      setLoading(true);
      await register(email, password, nombre);
      setSuccess("¡Cuenta creada con éxito! Redirigiendo a inicio de sesión...");
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.error("Error de registro:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError("Este correo ya está registrado.");
      } else if (err.code === "auth/invalid-email") {
        setError("El correo electrónico no es válido.");
      } else if (err.code === "auth/weak-password") {
        setError("La contraseña debe tener al menos 6 caracteres.");
      } else if (err.code === "auth/network-request-failed") {
        setError("Error de red. Verifica tu conexión a internet.");
      } else if (err.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.") {
        setError("Error de configuración Firebase. Verifica las credenciales en firebase.js");
      } else {
        setError(`Error: ${err.code}`);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bienve">
      <div className="fila-superior">
        <img src="/imagenes/logo.png" className="libro-img" alt="logo" />
        <div className="text">
          <h1>Registrate</h1>
          <p>
            Crea tu cuenta, te llevará menos de un minuto
            <br />
            Si ya tienes una cuenta{" "}
            <a href="/login" style={{ color: "#2b5c3d", fontWeight: "bold" }}>
              Inicia Sesión
            </a>
          </p>
        </div>
        <img src="/imagenes/logo.png" className="libro-img" alt="logo" />
      </div>

      <div className="ingres">
        <form className="formula" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <span className="icon">👤</span>
            <input
              type="text"
              placeholder="Nombres completos"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="icon">✉</span>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <p className="mensaje-form fallo">{error}</p>}
          {success && <p className="mensaje-form exito">{success}</p>}

          <button type="submit" className="btn-iniciar" disabled={loading}>
            {loading ? "Creando..." : "¡Hecho!"}
          </button>
        </form>
      </div>
    </main>
  );
}
