"use client";

import { createContext, useContext } from "react";
import { MessageResponseDTO, UserDTO } from "@/types/chat";

export interface ChatContextType {
  chatUsers: UserDTO[];
  unreadCount: number;
  selectedChat: UserDTO | null;
  messages: { [userId: number]: MessageResponseDTO[] };
  loadingUsers: boolean;
  loadingMessages: boolean;
  cursors: { [userId: number]: string | null };
  fetchChatUsers: () => Promise<void>;
  selectChat: (user: UserDTO) => void;
  sendMessage: (content: string, recipientId: number) => Promise<void>;
  loadMoreMessages: (userId: number, loadOlder?: boolean) => Promise<void>;
  markChatAsRead: (senderId: number) => Promise<void>;
  hasMoreMessages: (userId: number) => boolean;
  setChatUsers: (updater: (prev: UserDTO[]) => UserDTO[]) => void;
}

export const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
