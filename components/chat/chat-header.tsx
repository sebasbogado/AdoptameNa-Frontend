"use client";

import React from 'react';
import { UserAvatar } from '@/components/ui/user-avatar';

interface ChatHeaderProps {
  name: string;
  online: boolean;
  onClose?: () => void;
  onMinimize?: () => void;
  showControls?: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  online,
  onClose,
  onMinimize,
  showControls = false
}) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-white">
      <div className="flex items-center">        <div className="relative mr-3">
          <UserAvatar fullName={name} size="md" />
          {online && (
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
          )}
        </div>
        <div>
          <h3 className="font-medium">{name}</h3>
          <p className="text-sm text-gray-500">
            {online ? 'En línea' : 'Offline'}
          </p>
        </div>
      </div>
      
      {showControls && onMinimize && onClose && (
        <div className="flex space-x-2">
          <button 
            onClick={onMinimize}
            className="text-gray-500 hover:bg-gray-100 rounded p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:bg-gray-100 rounded p-1"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
