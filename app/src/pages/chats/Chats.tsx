import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useChatsStore } from '../../stores/chats.store';
import { useAuthStore } from '../../stores/auth.store';
import ErrorMessage from '../../components/Profile/ErrorMessage';
import './Chats.css';

export const Chats = () => {
  const navigate = useNavigate();
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null);

  const { chats, fetchChats, loading } = useChatsStore();
  const { logout } = useAuthStore();

  useEffect(() => {
    fetchChats();
  }, []);

  const selectedChat = chats.find(
    (chat) => chat.id === selectedChatId
  );

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  return (
    <>
      <div className="chats-container">
        <div className="chats-sidebar">
          <div className="sidebar-header">
            <h1>Chats</h1>

            <div className="flex gap-2">
              <Link to="/profile">Perfil</Link>
              <button onClick={handleLogout}>Salir</button>
            </div>
          </div>

          <div className="chat-list-container">
            {loading && <p>Cargando chats...</p>}

            {!loading && chats.length === 0 && (
              <p>No hay chats disponibles</p>
            )}

            {!loading &&
              chats.map((chat) => (
                <div
                  key={chat.id}
                  className={`chat-item ${
                    chat.id === selectedChatId ? 'active' : ''
                  }`}
                  onClick={() => setSelectedChatId(chat.id)}
                >
                  {chat.name}
                </div>
              ))}
          </div>
        </div>

        <div className="chats-main">
          {!selectedChat ? (
            <p>Selecciona un chat</p>
          ) : (
            <h2>{selectedChat.name}</h2>
          )}
        </div>
      </div>

      <ErrorMessage />
    </>
  );
};
