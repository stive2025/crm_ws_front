import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("auth_token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl?: string;
  role?: string;     
}

export interface UserProfileUpdate {
  name: string;
  email: string;
}


export const fetchUserProfile = async (): Promise<User> => {
  try {
    const response = await api.get<User>("/users/profile"); 
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "No se pudo cargar el perfil");
  }
};

export const updateUserProfile = async (data: UserProfileUpdate): Promise<User> => {
  try {
    const response = await api.patch<User>("/users/profile", data);
    return response.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al actualizar el perfil");
  }
};

export const uploadProfilePicture = async (file: File): Promise<string> => {
  try {
    const formData = new FormData();
    formData.append("photo", file);

    const response = await api.post<{ photoUrl: string }>("/users/profile-picture", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.photoUrl;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || "Error al subir la foto de perfil");
  }
};

export const logout = () => {
  localStorage.removeItem("auth_token");
  window.location.href = "/login";
};

export default api;