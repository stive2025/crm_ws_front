// src/App.tsx
import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";

function App() {
  useEffect(() => {
    localStorage.removeItem("auth_token");
    console.log("Token de autenticación limpiado al cargar la app");
  }, []); 

  return <AppRouter />;
}

export default App;