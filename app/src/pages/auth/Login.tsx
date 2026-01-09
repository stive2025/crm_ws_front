import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";
import callImage from "../../images/called.png";

import { useAuthStore } from "../../stores/auth.store";

import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const {
    login,
    loading,
    error: errorFromStore,
    isAuthenticated,
  } = useAuthStore();

  // Efecto para redirigir cuando esté autenticado
  useEffect(() => {
    console.log("🔍 Login - Efecto ejecutándose, isAuthenticated:", isAuthenticated);
    
    // Verificar tanto el store como localStorage para mayor seguridad
    const token = localStorage.getItem("auth_token");
    if (token || isAuthenticated) {
      console.log("✅ Login - Redirigiendo a /chats");
      // Pequeño delay para asegurar que todo está listo
      setTimeout(() => {
        navigate("/chats", { replace: true });
      }, 100);
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    console.log("🔄 Login - Iniciando proceso de login...");
    const success = await login(email, password);
    
    if (success) {
      console.log("✅ Login - Proceso completado, esperando redirección...");
    } else {
      console.log("❌ Login - Falló el proceso");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-card-content">
          <div className="login-left">
            <h1 className="login-title">BIENVENIDO</h1>

            <div className="divider">
              <span className="divider-icon">🔑</span>
            </div>

            <h2 className="login-subtitle">Ingrese sus Credenciales</h2>

            <form className="login-form" onSubmit={handleSubmit}>
              <Input
                type="email"
                placeholder="Correo"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoFocus
              />

              <Input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? <Loader size="sm" /> : "Ingresar"}
              </Button>

              {errorFromStore && (
                <p className="login-error mt-3">{errorFromStore}</p>
              )}
            </form>
          </div>

          <div className="login-right">
            <img
              src={callImage}
              className="login-image"
              alt="Ilustración de llamada o contacto"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;