import { create } from "zustand";

interface User {
  name: string;
  email: string;
  role: number;
}

interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  isDirty: boolean;            
  setUser: (user: User) => void;
  setIsDirty: (isDirty: boolean) => void; 
  reset: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  isDirty: false,           

  setUser: (user) => set({ 
    user,
    isDirty: true            
  }),

  setIsDirty: (isDirty) => set({ isDirty }),

  reset: () =>
    set({
      user: null,
      isLoading: false,
      error: null,
      isDirty: false,         
    }),
}));