import { MediaDTO } from "./user-profile";

export interface MessageDTO {
  id?: number;
  content: string;
  senderId: number;
  recipientId: number;
  sentAt?: Date;
  read?: boolean;
  mediaIds?: number[]; // Optional array of media IDs
}

export interface MessageResponseDTO {
  id: number | string;
  content: string;
  senderId: number;
  senderName: string;
  recipientId: number;
  recipientName: string;
  sentAt: Date;
  read: boolean;
  media: MediaDTO[];
}

export interface PagedMessageResponseDTO {
  messages: MessageResponseDTO[];
  nextCursor: string | null;
  hasMore: boolean;
  total: number;
}

export interface UserDTO {
  id: number;
  email: string;
  creationDate?: Date;
  role?: string;
  isVerified?: boolean;
  online: boolean;
  unreadMessagesCount: number;
  name: string;
}

export interface MarkReadDTO {
  senderId: number;
  recipientId: number;
}
