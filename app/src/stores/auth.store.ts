// src/stores/auth.store.ts
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware"; 
import api from "../services/api";
import { useUserStore } from "./user.store";
import { useErrorStore } from "./error.store";

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
  checkAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      status: null,
      user: null,
      token: null,
      accessToken: null,
      isAuthenticated: false,
      loading: false,
      error: null,

      checkAuth: async () => {
        const token = localStorage.getItem("auth_token");
        
        if (!token) {
          set({ 
            isAuthenticated: false, 
            user: null,
            token: null,
            loading: false 
          });
          return;
        }

        try {
          set({ loading: true });
          
          api.defaults.headers.common.Authorization = `Bearer ${token}`;

          const response = await api.get<{ user: AuthUser }>("/user");
          
          const user = response.data.user;

          set({
            user,
            token,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          useUserStore.getState().setUser({
            name: user.name,
            email: user.email,
            role: user.role,
          });

        } catch (err: any) {
          console.error("Error al verificar autenticación:", err);
          
          localStorage.removeItem("auth_token");
          delete api.defaults.headers.common.Authorization;
          
          set({
            user: null,
            token: null,
            isAuthenticated: false,
            loading: false,
            error: err.message,
          });
        }
      },

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

          localStorage.setItem("auth_token", plainToken);
          api.defaults.headers.common.Authorization = `Bearer ${plainToken}`;

          set({
            status,
            user,
            token: plainToken,
            accessToken: token.accessToken,
            isAuthenticated: true,
            loading: false,
            error: null,
          });

          useUserStore.getState().setUser({
            name: user.name,
            email: user.email,
            role: user.role,
          });

          return true;
        } catch (err: any) {
          const errorMessage = err.message || "Error de autenticación";
          
          set({
            error: errorMessage,
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
        useErrorStore.getState().clearError(); 
        
        window.location.href = "/login";
      },
    }),

    {
      name: 'auth-storage', 
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({

        user: state.user,

        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);