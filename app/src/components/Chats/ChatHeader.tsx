// src/components/chats/ChatHeader.tsx
import React from 'react';

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

interface ChatHeaderProps {
  chat?: Chat;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat }) => {
  if (!chat) {
    return (
      <div className="border-b border-gray-200 p-4">
        <h2 className="text-lg font-semibold text-gray-900">Selecciona un chat</h2>
      </div>
    );
  }

  const participants = chat.participants || [];
  const isGroupChat = participants.length > 2;
  
  const displayName = isGroupChat 
    ? chat.name || `${participants.length} personas`
    : participants.find(p => p.id !== 'current-user-id')?.name || chat.name;

  return (
    <div className="border-b border-gray-200 p-4">
      <div className="flex items-center">
        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold mr-3">
          {displayName.substring(0, 2).toUpperCase()}
        </div>
        <div>
          <h2 className="text-lg font-semibold text-gray-900">{displayName}</h2>
          {isGroupChat && (
            <p className="text-sm text-gray-500">
              {participants.length} participantes
            </p>
          )}
        </div>
      </div>
    </div>
  );
};