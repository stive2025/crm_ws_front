// src/App.tsx
import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";

function App() {
  useEffect(() => {
    // Solo en desarrollo, limpiar el token
    if (import.meta.env.DEV) {
      localStorage.removeItem("auth_token");
      console.log("Token limpiado en desarrollo");
    }
    
    // O si quieres limpiar siempre:
    // localStorage.removeItem("auth_token");
  }, []);
  
  return <AppRouter />;
}

export default App;