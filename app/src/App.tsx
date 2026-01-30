// src/App.tsx
import { useEffect } from "react";
import AppRouter from "./routes/AppRouter";
import ErrorMessage from "./components/Profile/ErrorMessage";

function App() {
  useEffect(() => {
    const sessionFlag = sessionStorage.getItem('browser_session');
    
    if (!sessionFlag) {
      localStorage.removeItem('auth_token');

      sessionStorage.setItem('browser_session', 'active');
    }
  }, []);

  return (
    <>
      <AppRouter />
      <ErrorMessage />
    </>
  );
}

export default App;