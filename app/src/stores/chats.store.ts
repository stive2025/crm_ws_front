// src/stores/chats.store.ts
import { create } from 'zustand';
import api from '../services/api';

// Tipos definidos aquí mismo
interface Chat {
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

interface PaginatedChats {
  data: Chat[];
  meta: {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
  };
}

interface ChatsStore {
  chats: Chat[];
  loading: boolean;
  error: string | null;
  pagination: {
    currentPage: number;
    lastPage: number;
    perPage: number;
    total: number;
  };
  
  // Actions
  fetchChats: (page?: number) => Promise<void>;
  setChats: (chats: Chat[]) => void;
  updateChat: (chatId: string, updates: Partial<Chat>) => void;
  addChat: (chat: Chat) => void;
  markChatAsRead: (chatId: string) => Promise<void>;
  clearChats: () => void;
}

export const useChatsStore = create<ChatsStore>((set, get) => ({
  chats: [],
  loading: false,
  error: null,
  pagination: {
    currentPage: 1,
    lastPage: 1,
    perPage: 20,
    total: 0,
  },

  fetchChats: async (page = 1) => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<PaginatedChats>('/chats', {
        params: { page, per_page: 20 }
      });
      set({
        chats: response.data.data,
        loading: false,
        pagination: {
          currentPage: response.data.meta.current_page,
          lastPage: response.data.meta.last_page,
          perPage: response.data.meta.per_page,
          total: response.data.meta.total,
        },
      });
    } catch (error: any) {
      set({
        loading: false,
        error: error.response?.data?.message || 'Error al cargar los chats',
      });
    }
  },

  setChats: (chats) => set({ chats }),

  updateChat: (chatId, updates) => {
    set((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === chatId ? { ...chat, ...updates } : chat
      ),
    }));
  },

  addChat: (chat) => {
    set((state) => ({
      chats: [chat, ...state.chats],
    }));
  },

  markChatAsRead: async (chatId: string) => {
    try {
      await api.post(`/chats/${chatId}/mark-as-read`);
      get().updateChat(chatId, { unread_count: 0 });
    } catch (error) {
      console.error('Error marking chat as read:', error);
    }
  },

  clearChats: () => set({ chats: [], loading: false, error: null }),
}));

// Exportar los tipos si los necesitas en otros componentes
export type { Chat, PaginatedChats };