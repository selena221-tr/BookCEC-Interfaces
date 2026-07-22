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
      setError({ title: "Nombre requerido", msg: "Ingresa tu nombre completo para crear tu cuenta." });
      return;
    }
    if (!regexNombre.test(nombre)) {
      setError({ title: "Nombre inválido", msg: "El nombre debe tener al menos 3 letras y no puede contener números ni caracteres especiales." });
      return;
    }
    if (!email.trim()) {
      setError({ title: "Correo requerido", msg: "Ingresa tu dirección de correo electrónico." });
      return;
    }
    if (!regexEmail.test(email)) {
      setError({ title: "Correo inválido", msg: "El formato del correo no es válido. Ejemplo: usuario@dominio.com" });
      return;
    }
    if (!password) {
      setError({ title: "Contraseña requerida", msg: "Crea una contraseña para proteger tu cuenta." });
      return;
    }
    if (password.length < 6) {
      setError({ title: "Contraseña débil", msg: "La contraseña debe tener al menos 6 caracteres. Recomendamos incluir letras, números y símbolos." });
      return;
    }
    if (password.length > 0 && password.length < 8) {
      setError({ title: "Contraseña poco segura", msg: "Para mayor seguridad, usa al menos 8 caracteres con una combinación de letras, números y símbolos." });
      return;
    }
    if (password !== confirmPassword) {
      setError({ title: "Las contraseñas no coinciden", msg: "Verifica que ambas contraseñas sean idénticas. Revisa si hay errores de escritura." });
      return;
    }

    try {
      setLoading(true);
      await register(email, password, nombre);
      setSuccess({ title: "¡Cuenta creada!", msg: "Tu registro fue exitoso. Serás redirigido al inicio de sesión en unos segundos..." });
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Error de registro:", err.code, err.message);
      if (err.code === "auth/email-already-in-use") {
        setError({ title: "Correo ya registrado", msg: "Ya existe una cuenta asociada a este correo. Intenta con otro correo o inicia sesión." });
      } else if (err.code === "auth/invalid-email") {
        setError({ title: "Correo inválido", msg: "La dirección de correo electrónico no tiene un formato válido." });
      } else if (err.code === "auth/weak-password") {
        setError({ title: "Contraseña débil", msg: "La contraseña debe tener al menos 6 caracteres. Usa una combinación de letras, números y símbolos." });
      } else if (err.code === "auth/network-request-failed") {
        setError({ title: "Sin conexión", msg: "No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo." });
      } else if (err.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.") {
        setError({ title: "Error de configuración", msg: "Hay un problema con la configuración de Firebase. Contacta al administrador." });
      } else if (err.code === "auth/operation-not-allowed") {
        setError({ title: "Registro no disponible", msg: "El registro con correo y contraseña no está habilitado. Contacta al administrador." });
      } else {
        setError({ title: "Error inesperado", msg: `Ocurrió un error (${err.code}). Intenta de nuevo o contacta al soporte.` });
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="bienve">
      <div className="fila-superior">
        <img src="/imagenes/logo.png" className="libro-img" alt="logo" />
      </div>

      <div className="text-login">
        <h1>Crear cuenta</h1>
        <p>Regístrate para comenzar a usar BookCEC</p>
      </div>

      <div className="ingres">
        <form className="formula" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <input
              type="text"
              placeholder="Nombres completos"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="input-group">
            <input
              type="password"
              placeholder="Confirmar contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="mensaje-form fallo">
              <span className="alert-icon">⚠️</span>
              <div className="alert-text">
                <strong>{error.title}</strong>
                <span>{error.msg}</span>
              </div>
            </div>
          )}

          {success && (
            <div className="mensaje-form exito">
              <span className="alert-icon">✅</span>
              <div className="alert-text">
                <strong>{success.title}</strong>
                <span>{success.msg}</span>
              </div>
            </div>
          )}

          <button type="submit" className="btn-iniciar" disabled={loading}>
            {loading ? "Creando cuenta..." : "Crear cuenta"}
          </button>

          <p className="login-link">
            ¿Ya tienes cuenta?{" "}
            <a href="/login">Inicia sesión</a>
          </p>
        </form>
      </div>
    </main>
  );
}
