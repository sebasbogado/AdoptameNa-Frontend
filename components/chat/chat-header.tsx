"use client";

import React from 'react';
import { UserAvatar } from '@/components/ui/user-avatar';

interface ChatHeaderProps {
  name: string;
  online: boolean;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({
  name,
  online,
}) => {
  return (
    <div className="p-4 border-b flex items-center justify-between bg-white">
      <div className="flex items-center">        
        <div className="relative mr-3">
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
    </div>
  );
};

export default ChatHeader;
