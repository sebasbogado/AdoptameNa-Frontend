"use client";

import React from 'react';
import { UserAvatar } from '@/components/ui/user-avatar';

interface ChatUserListItemProps {
  id: number;
  name: string;
  online: boolean;
  unreadMessagesCount: number;
  isSelected?: boolean;
  onClick: () => void;
  onMarkAsRead?: () => void;
  showStatus?: boolean;
  compact?: boolean;
}

const ChatUserListItem: React.FC<ChatUserListItemProps> = ({
  id,
  name,
  online,
  unreadMessagesCount,
  isSelected = false,
  onClick,
  onMarkAsRead,
  showStatus = true,
  compact = false
}) => {
  const handleMarkAsRead = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsRead) {
      onMarkAsRead();
    }
  };

  return (
    <div 
      key={id} 
      className={`flex items-center ${compact ? 'p-2' : 'p-3'} cursor-pointer relative ${
        isSelected ? 'bg-blue-gray-100' : 'hover:bg-gray-100'
      } ${unreadMessagesCount > 0 && !isSelected ? 'bg-purple-50' : ''}`}
      onClick={onClick}
    >      <div className="relative mr-3">
        <UserAvatar userId={id} fullName={name} size={compact ? "sm" : "md"} />
        {online && (
          <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
        )}
      </div>
      <div className="flex-1 min-w-0 overflow-hidden">
        <div className="flex justify-between items-center w-full">
          <p className="font-medium truncate max-w-[70%] pr-1">{name}</p>
          {unreadMessagesCount > 0 && (
            <span className="bg-purple-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center ml-2 flex-shrink-0">
              {unreadMessagesCount}
            </span>
          )}
        </div>
        {showStatus && (
          <p className="text-sm text-gray-500 truncate">
            {online ? 'En línea' : 'Offline'}
          </p>
        )}
      </div>
      
      {onMarkAsRead && unreadMessagesCount > 0 && (
        <button 
          onClick={handleMarkAsRead}
          className="ml-2 text-xs text-purple-600 hover:text-purple-800 p-1 hover:bg-gray-200 rounded-full"
        >
          <span className="sr-only">Marcar como leído</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ChatUserListItem;
