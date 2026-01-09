// src/services/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para agregar token de autenticación
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token'); // Cambié 'access_token' a 'auth_token'
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('auth_token'); // Cambié 'access_token' a 'auth_token'
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Tipos para chats
export interface Chat {
  id: string;
  name: string;
  last_message?: string;
  unread_count?: number;
  updated_at?: string;
  participants?: Array<{
    id: string;
    name: string;
    email: string;
    avatar?: string;
  }>;
}

export interface PaginatedChats {
  data: Chat[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

export default api;