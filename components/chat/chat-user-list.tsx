"use client";

import { UserDTO } from "@/types/chat";
import { UserCircle, Search } from "lucide-react";
import clsx from "clsx";
import { useEffect, useState } from "react";
import { useChat } from "@/contexts/chat-context";

interface ChatUserListProps {
  users: UserDTO[];
  selectedUser: UserDTO | null;
  onSelectUser: (user: UserDTO) => void;
  className?: string;
}

const ChatUserList = ({ 
  users, 
  selectedUser, 
  onSelectUser,
  className 
}: ChatUserListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<UserDTO[]>(users);
  
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredUsers(users);
    } else {
      const query = searchQuery.toLowerCase();
      setFilteredUsers(
        users.filter(user => 
          user.name.toLowerCase().includes(query) || 
          user.email.toLowerCase().includes(query)
        )
      );
    }
  }, [searchQuery, users]);
  
  return (
    <div className={clsx("flex flex-col h-full bg-white border-r border-gray-200", className)}>
      <div className="p-3 border-b border-gray-200">
        <div className="relative">
          <input
            type="text"
            placeholder="Buscar usuario..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full py-2 pl-10 pr-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-gray-500"
          />
          <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredUsers.length > 0 ? (
          <div className="divide-y divide-gray-100">
            {filteredUsers.map(user => (
              <div
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={clsx(
                  "flex items-center p-3 cursor-pointer hover:bg-gray-50",
                  selectedUser?.id === user.id && "bg-blue-gray-50",
                  user.unreadMessagesCount > 0 && "bg-blue-gray-50"
                )}
              >
                <div className="relative mr-3">
                  <UserCircle size={40} className="text-blue-gray-500" />
                  {user.online && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-medium truncate">{user.name}</p>
                    {user.unreadMessagesCount > 0 && (
                      <span className="ml-2 bg-blue-gray-500 text-white text-xs px-2 py-0.5 rounded-full">
                        {user.unreadMessagesCount}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 truncate">{user.email}</p>
                </div>
                <div className="ml-2 text-xs text-gray-500">
                  {user.online ? (
                    <span className="text-green-500">En línea</span>
                  ) : (
                    <span>Offline</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-gray-500">No se encontraron usuarios</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatUserList;
