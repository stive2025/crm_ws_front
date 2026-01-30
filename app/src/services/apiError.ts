// src/services/apiError.ts
export interface ApiError {
  status: number;
  message: string;
  originalError?: any;
}

export const parseApiError = (error: any): ApiError => {
  const status = error.response?.status || 0;
  const serverMessage = error.response?.data?.message;

  const friendlyMessages: Record<number, string> = {
    400: 'Los datos enviados no son válidos. Por favor, verifica la información.',
    401: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
    403: 'No tienes permisos para realizar esta acción.',
    404: 'El recurso solicitado no fue encontrado.',
    409: 'Ya existe un registro con estos datos.',
    422: 'Los datos proporcionados no son válidos.',
    429: 'Has realizado demasiadas solicitudes. Por favor, espera un momento.',
    500: 'Ocurrió un error en el servidor. Por favor, intenta más tarde.',
    502: 'El servidor no está disponible en este momento.',
    503: 'El servicio no está disponible temporalmente.',
    504: 'El servidor tardó demasiado en responder.',
  };

  const message = serverMessage || friendlyMessages[status] || 'Ocurrió un error inesperado. Por favor, intenta nuevamente.';

  return { 
    status, 
    message,
    originalError: error 
  };
};

export const isRetryableError = (status: number): boolean => {
  return [408, 429, 500, 502, 503, 504].includes(status);
};