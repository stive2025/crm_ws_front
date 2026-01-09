// src/components/common/ProtectedRoute.tsx - VERSIÓN FINAL
import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { Loader } from './Loader';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('auth_token');
      setIsAuthenticated(!!token);
      setIsChecking(false);
    };
    
    const timer = setTimeout(checkAuth, 50);
    return () => clearTimeout(timer);
  }, []);

  if (isChecking) {
    return <Loader />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};