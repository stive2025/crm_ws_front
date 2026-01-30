// src/services/api.ts
import axios from 'axios';
import { parseApiError, isRetryableError } from './apiError';
import { useErrorStore } from '../stores/error.store';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000, 
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('auth_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const parsedError = parseApiError(error);
    
    if (parsedError.status === 401) {
      localStorage.removeItem('auth_token');
      delete api.defaults.headers.common.Authorization;
    }
    
    const shouldShowGlobalError = [401, 500, 502, 503, 504].includes(parsedError.status);
    
    if (shouldShowGlobalError) {
      const canRetry = isRetryableError(parsedError.status);
      
      useErrorStore.getState().setError(
        parsedError,
        canRetry ? () => {
          return api.request(error.config);
        } : undefined
      );
    }
    
    return Promise.reject(parsedError);
  }
);

export default api;