import { create } from 'zustand';
import type { ApiError } from '../services/apiError';

interface ErrorState {
  error: ApiError | null;
  retryAction: (() => void) | null;
  setError: (error: ApiError, retryAction?: () => void) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  error: null,
  retryAction: null,

  setError: (error, retryAction) =>
    set({
      error,
      retryAction: retryAction ?? null,
    }),

  clearError: () =>
    set({
      error: null,
      retryAction: null,
    }),
}));
