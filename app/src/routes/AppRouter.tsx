// src/routes/AppRouter.tsx
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../pages/auth/Login";
import { Chats } from "../pages/chats/Chats";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { Loader } from "../components/common/Loader";

// Componente para manejar redirecciones iniciales
const InitialRedirectHandler = () => {
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 100);
    return () => clearTimeout(timer);
  }, []);
  
  if (isChecking) {
    return <Loader />;
  }
  
  const token = localStorage.getItem('auth_token');
  console.log("🏠 InitialRedirectHandler - Token:", token ? "Sí" : "No");
  
  return token ? 
    <Navigate to="/chats" replace /> : 
    <Navigate to="/login" replace />;
};

// Componente personalizado para la ruta /login
const LoginRoute = () => {
  const [isChecking, setIsChecking] = useState(true);
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsChecking(false);
    }, 150);
    return () => clearTimeout(timer);
  }, []);
  
  if (isChecking) {
    return <Loader />;
  }
  
  // Verificar SI hay token - si lo hay, redirigir a chats
  const token = localStorage.getItem('auth_token');
  console.log("🔐 LoginRoute - Token encontrado:", token ? "Sí" : "No");
  
  if (token) {
    console.log("↪️ LoginRoute - Redirigiendo a /chats");
    return <Navigate to="/chats" replace />;
  }
  
  console.log("✅ LoginRoute - Mostrando Login");
  return <Login />;
};

// Componente para bloquear navegación a login
const NavigationGuard = () => {
  useEffect(() => {
    // Protección extra: si alguien escribe /login manualmente
    const handleUrlChange = () => {
      const token = localStorage.getItem('auth_token');
      const currentPath = window.location.pathname;
      
      if (token && currentPath === '/login') {
        console.log("🚫 NavigationGuard - Bloqueando acceso a /login con token");
        window.history.replaceState(null, '', '/chats');
      }
    };
    
    // Verificar al cargar
    handleUrlChange();
    
    // Verificar cuando cambia la URL
    window.addEventListener('popstate', handleUrlChange);
    
    return () => {
      window.removeEventListener('popstate', handleUrlChange);
    };
  }, []);
  
  return null;
};

const AppRouter = () => {
  return (
    <BrowserRouter>
      <NavigationGuard />
      <Routes>
        {/* Ruta raíz */}
        <Route path="/" element={<InitialRedirectHandler />} />
        
        {/* Login - manejo manual */}
        <Route path="/login" element={<LoginRoute />} />

        {/* Chats - protegida */}
        <Route 
          path="/chats" 
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          } 
        />

        {/* Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;