// src/components/chats/ChatItem.tsx
import React from 'react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

// Definir tipo aquí mismo (copiado del store)
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

interface ChatItemProps {
  chat: Chat;
  isSelected?: boolean;
  onClick: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({ chat, isSelected = false, onClick }) => {
  const formatTime = (dateString?: string) => {
    if (!dateString) return '';
    try {
      return formatDistanceToNow(new Date(dateString), {
        addSuffix: true,
        locale: es,
      });
    } catch {
      return '';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const participants = chat.participants || [];
  const isGroupChat = participants.length > 2;
  
  const displayName = isGroupChat 
    ? chat.name || `${participants.length} personas`
    : participants.find(p => p.id !== 'current-user-id')?.name || chat.name;

  return (
    <div
      className={`flex items-center p-4 cursor-pointer transition-colors hover:bg-gray-50 ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onClick={onClick}
    >
      <div className="relative">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          {getInitials(displayName)}
        </div>
        {chat.unread_count && chat.unread_count > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {chat.unread_count}
          </span>
        )}
      </div>
      
      <div className="ml-4 flex-1 min-w-0">
        <div className="flex justify-between items-baseline">
          <h3 className="font-semibold text-gray-900 truncate">
            {displayName}
          </h3>
          {chat.updated_at && (
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatTime(chat.updated_at)}
            </span>
          )}
        </div>
        
        <p className="text-sm text-gray-600 truncate mt-1">
          {chat.last_message || 'No hay mensajes aún'}
        </p>
        
        {isGroupChat && (
          <div className="flex items-center mt-1">
            <span className="text-xs text-gray-500">
              {participants.length} participantes
            </span>
          </div>
        )}
      </div>
    </div>
  );
};