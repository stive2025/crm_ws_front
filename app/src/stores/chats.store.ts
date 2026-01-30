import { create } from 'zustand';
import api from '../services/api';
import { useErrorStore } from './error.store';

export interface Chat {
  id: string;
  name: string;
}

interface ChatsStore {
  chats: Chat[];
  loading: boolean;
  error: string | null;      
  fetchChats: () => Promise<void>;
}

export const useChatsStore = create<ChatsStore>((set) => ({
  chats: [],
  loading: false,
  error: null,                  
  fetchChats: async () => {
    set({ loading: true, error: null });  

    try {
      const res = await api.get('/chats');

      set({
        chats: res.data?.data ?? [],
        loading: false,
        error: null,
      });
    } catch (error: any) {
      const message = error.response?.data?.message || error.message || 'Error al cargar los chats';

      useErrorStore.getState().setError(message, () => useChatsStore.getState().fetchChats());

      set({ 
        loading: false,
        error: message,           
      });
    }
  },
}));