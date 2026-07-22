import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError({ title: "Correo requerido", msg: "Ingresa tu dirección de correo electrónico para continuar." });
      return;
    }
    if (!regexEmail.test(email)) {
      setError({ title: "Correo inválido", msg: "El formato del correo no es válido. Ejemplo: usuario@dominio.com" });
      return;
    }
    if (!password) {
      setError({ title: "Contraseña requerida", msg: "Ingresa tu contraseña para acceder a tu cuenta." });
      return;
    }
    if (password.length < 6) {
      setError({ title: "Contraseña muy corta", msg: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error de login:", err.code, err.message);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError({ title: "Credenciales incorrectas", msg: "El correo o la contraseña no son correctos. Verifica tus datos e intenta nuevamente." });
      } else if (err.code === "auth/user-disabled") {
        setError({ title: "Cuenta deshabilitada", msg: "Tu cuenta ha sido desactivada. Contacta al administrador para más información." });
      } else if (err.code === "auth/too-many-requests") {
        setError({ title: "Demasiados intentos", msg: "Se han realizado muchos intentos fallidos. Espera unos minutos antes de intentar de nuevo." });
      } else if (err.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.") {
        setError({ title: "Error de configuración", msg: "Hay un problema con la configuración de Firebase. Contacta al administrador." });
      } else if (err.code === "auth/network-request-failed") {
        setError({ title: "Sin conexión", msg: "No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo." });
      } else if (err.code === "auth/invalid-email") {
        setError({ title: "Correo inválido", msg: "La dirección de correo electrónico no tiene un formato válido." });
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
        <h1>Bienvenido</h1>
        <p>Inicia sesión para continuar</p>
      </div>

      <div className="ingres">
        <form className="formula" onSubmit={handleSubmit} noValidate>
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

          {error && (
            <div className="mensaje-form fallo">
              <span className="alert-icon">⚠️</span>
              <div className="alert-text">
                <strong>{error.title}</strong>
                <span>{error.msg}</span>
              </div>
            </div>
          )}

          <button type="submit" className="btn-iniciar" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar sesión"}
          </button>

          <p className="login-link">
            ¿No tienes cuenta?{" "}
            <a href="/register">Regístrate aquí</a>
          </p>
        </form>
      </div>
    </main>
  );
}
