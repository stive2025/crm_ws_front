// src/pages/chats/Chats.tsx
import React, { useState, useEffect } from 'react';
import { ChatList } from '../../components/Chats/ChatList';
import { ChatHeader } from '../../components/Chats/ChatHeader';
import { useChatsStore } from '../../stores/chats.store';
import { useAuthStore } from '../../stores/auth.store';
import './Chats.css';

export const Chats: React.FC = () => {
  const [selectedChatId, setSelectedChatId] = useState<string>();
  const { chats } = useChatsStore();
  const { logout } = useAuthStore();
  
  const selectedChat = chats.find(chat => chat.id === selectedChatId);

  // Bloquear navegación hacia atrás
  useEffect(() => {
    // Verificar token
    const token = localStorage.getItem('auth_token');
    if (!token) {
      window.location.href = '/login';
      return;
    }

    // Agregar estado al historial para bloquear el botón "atrás"
    window.history.pushState(null, '', window.location.href);
    
    // Manejar evento popstate (botón atrás)
    const handlePopState = () => {
      // Prevenir cualquier navegación fuera de chats
      window.history.pushState(null, '', '/chats');
    };

    window.addEventListener('popstate', handlePopState);
    
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  // Función para cerrar sesión
  const handleLogout = () => {
    logout(); // Usa el logout de tu store
  };

  return (
    <div className="chats-container">
      {/* ... resto del código permanece igual ... */}
      <div className="chats-sidebar">
        <div className="sidebar-header">
          <h1 className="text-xl font-bold text-gray-900">Chats</h1>
          <div className="flex items-center gap-2">
            <button 
              onClick={handleLogout}
              className="logout-button px-3 py-1.5 text-sm bg-red-100 text-red-700 hover:bg-red-200 rounded-md transition-colors"
              title="Cerrar sesión"
            >
              Salir
            </button>
            <button className="new-chat-button">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Nuevo chat
            </button>
          </div>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="Buscar conversaciones..."
            className="search-input"
          />
        </div>

        <div className="chat-list-container">
          <ChatList
            selectedChatId={selectedChatId}
            onSelectChat={setSelectedChatId}
          />
        </div>
      </div>

      <div className="chats-main">
        <ChatHeader chat={selectedChat} />
        
        <div className="chat-content">
          {selectedChat ? (
            <div className="flex flex-col h-full justify-center items-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                {selectedChat.name || 'Conversación'}
              </h3>
              <p className="text-gray-500 text-center max-w-md">
                Esta conversación está vacía. Envía un mensaje para comenzar.
              </p>
            </div>
          ) : (
            <div className="flex flex-col h-full justify-center items-center">
              <div className="text-gray-400 mb-4">
                <svg className="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Bienvenido a los chats
              </h3>
              <p className="text-gray-500">
                Selecciona una conversación para comenzar a chatear
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};