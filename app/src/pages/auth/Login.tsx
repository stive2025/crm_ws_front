// src/pages/auth/Login.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import callImage from "../../images/called.png";
import { useAuthStore } from "../../stores/auth.store";
import { Input } from "../../components/common/Input";
import { Button } from "../../components/common/Button";
import { Loader } from "../../components/common/Loader";
import { CustomAlert } from "../../components/common/Alert";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    loading,
    error: errorFromStore,
    isAuthenticated,
    user,
  } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      const from = (location.state as any)?.from || "/profile";
      navigate(from, { replace: true });
    }
  }, [isAuthenticated, user, navigate, location]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      return;
    }

    await login(email, password);
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
                <CustomAlert 
                  severity="error"
                  message={errorFromStore}
                />
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