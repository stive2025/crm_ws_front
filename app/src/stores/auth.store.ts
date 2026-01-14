// src/stores/auth.store.ts
import { create } from "zustand";
import api from "../services/api";

interface AccessToken {
  name: string;
  abilities: string[];
  expires_at: string | null;
  tokenable_id: number;
  tokenable_type: string;
  created_at: string;
  updated_at: string;
  id: number;
}

interface TokenData {
  accessToken: AccessToken;
  plainTextToken: string;
}

interface User {
  id: number;
  name: string;
  email: string;
  role: number;
  abilities: string[] | string;
  created_at: string;
  updated_at: string;
}

interface AuthResponse {
  status: number;
  token: TokenData;
  user: User;
}

interface AuthState {
  status: number | null;
  user: User | null;
  token: string | null;
  accessToken: AccessToken | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  status: null,
  user: null,
  token: null,
  accessToken: null,
  isAuthenticated: false,
  loading: false,
  error: null,

  login: async (email, password) => {
    set({ loading: true, error: null });

    try {
      const response = await api.post<AuthResponse>("/login", {
        email,
        password,
      });

      const { status, token, user } = response.data;

      const plainToken = token.plainTextToken;
      const accessToken = token.accessToken;

      if (!plainToken) {
        throw new Error("No se recibió plainTextToken");
      }

      // 1. Guardar token en localStorage
      localStorage.setItem("auth_token", plainToken);
      console.log("✅ Token guardado:", plainToken.substring(0, 20) + "...");

      // 2. Configurar token en headers de axios
      api.defaults.headers.common.Authorization = `Bearer ${plainToken}`;

      // 3. Actualizar el store COMPLETAMENTE
      set({
        status,
        user,
        token: plainToken,
        accessToken,
        isAuthenticated: true,
        loading: false,
      });

      console.log("✅ Store actualizado - isAuthenticated = true");
      return true;

    } catch (err: any) {
      console.error("🔴 ERROR LOGIN:", err);
      set({
        error: err.response?.data?.message || err.message || "Error de autenticación",
        loading: false,
      });
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("auth_token");
    delete api.defaults.headers.common.Authorization;

    set({
      status: null,
      user: null,
      token: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,
    });

    // Redirigir a login
    window.location.href = '/login';
  },
}));