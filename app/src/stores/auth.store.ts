import { create } from "zustand";
import api from "../services/api";
import { useUserStore } from "./user.store";

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

export interface AuthUser {
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
  user: AuthUser;
}

interface AuthState {
  status: number | null;
  user: AuthUser | null;
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
      if (!plainToken) {
        throw new Error("No se recibió el token");
      }

      // 🔐 Guardar token
      localStorage.setItem("auth_token", plainToken);

      // 🔗 Configurar axios
      api.defaults.headers.common.Authorization = `Bearer ${plainToken}`;

      // 🧠 Guardar en auth.store
      set({
        status,
        user,
        token: plainToken,
        accessToken: token.accessToken,
        isAuthenticated: true,
        loading: false,
      });

      // 🔄 Sincronizar con user.store
      useUserStore.getState().setUser({
        name: user.name,
        email: user.email,
        role: user.role,
      });

      return true;
    } catch (err: any) {
      set({
        error:
          err.response?.data?.message ||
          err.message ||
          "Error de autenticación",
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

    useUserStore.getState().reset();
    window.location.href = "/login";
  },
}));
