import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Login from "../pages/auth/Login";
import { Chats } from "../pages/chats/Chats";
import Profile from "../pages/profile/Profile";
import { ProtectedRoute } from "../components/common/ProtectedRoute";
import { Loader } from "../components/common/Loader";

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
  console.log(" InitialRedirectHandler - Token:", token ? "Sí" : "No");
  
  // Redirigir a profile si está autenticado
  return token ? 
    <Navigate to="/profile" replace /> : 
    <Navigate to="/login" replace />;
};

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
  
  const token = localStorage.getItem('auth_token');
  console.log(" LoginRoute - Token encontrado:", token ? "Sí" : "No");
  
  if (token) {
    console.log("↪ LoginRoute - Redirigiendo a /profile");
    return <Navigate to="/profile" replace />;
  }
  
  console.log(" LoginRoute - Mostrando Login");
  return <Login />;
};

const NavigationGuard = () => {
  useEffect(() => {
    const handleUrlChange = () => {
      const token = localStorage.getItem('auth_token');
      const currentPath = window.location.pathname;
      
      if (token && currentPath === '/login') {
        console.log(" NavigationGuard - Bloqueando acceso a /login con token");
        window.history.replaceState(null, '', '/profile');
      }
    };
    
    handleUrlChange();
    
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
        <Route path="/" element={<InitialRedirectHandler />} />
        
        <Route path="/login" element={<LoginRoute />} />

        <Route 
          path="/chats" 
          element={
            <ProtectedRoute>
              <Chats />
            </ProtectedRoute>
          } 
        />

        <Route 
          path="/profile" 
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } 
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;