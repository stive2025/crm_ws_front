import { Navigate, useLocation } from 'react-router-dom';
import type { ReactNode } from 'react';
import { useAuthStore } from '../../stores/auth.store';
import { CircularProgress, Box } from '@mui/material';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, loading } = useAuthStore();
  const location = useLocation();
  
  const token = localStorage.getItem('auth_token');
  
  if (token && loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated && !token) {

    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  if (token && !isAuthenticated && !loading) {
    return (
      <Box 
        sx={{ 
          minHeight: '100vh', 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center' 
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
};