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

    try {
      setLoading(true);
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/dashboard");
    } catch (err) {
      console.error("Error de login:", err.code, err.message);
      if (err.code === "auth/invalid-credential" || err.code === "auth/wrong-password" || err.code === "auth/user-not-found") {
        setError("Correo o contraseña incorrectos.");
      } else if (err.code === "auth/api-key-not-valid.-please-pass-a-valid-api-key.") {
        setError("Error de configuración Firebase. Verifica las credenciales en firebase.js");
      } else if (err.code === "auth/network-request-failed") {
        setError("Error de red. Verifica tu conexión a internet.");
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
          <h1>Bienvenido</h1>
          <p>Por favor, inicie sesión con su correo electrónico</p>
        </div>
        <img src="/imagenes/logo.png" className="libro-img" alt="logo" />
      </div>

      <div className="ingres">
        <form className="formula" onSubmit={handleSubmit} noValidate>
          <div className="input-group">
            <span className="icon">✉</span>
            <input
              type="email"
              placeholder="Ingrese su correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="icon">🔒</span>
            <input
              type="password"
              placeholder="Ingrese su contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && <p className="mensaje-form fallo">{error}</p>}

          <button type="submit" className="btn-iniciar" disabled={loading}>
            {loading ? "Iniciando..." : "Iniciar sesión ✎"}
          </button>

          <p style={{ marginTop: "15px", fontSize: "14px" }}>
            ¿No tienes cuenta?{" "}
            <a href="/register" style={{ color: "#2b5c3d", fontWeight: "bold" }}>
              Regístrate aquí
            </a>
          </p>
        </form>
      </div>
    </main>
  );
}
