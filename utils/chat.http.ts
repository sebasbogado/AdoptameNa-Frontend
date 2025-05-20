"use client";

import axios from "axios";
import { MessageDTO, MessageResponseDTO, PagedMessageResponseDTO, UserDTO } from "@/types/chat";

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/messages`;

/**
 * Envía un mensaje a un usuario
 */
export const sendMessage = async (messageDto: MessageDTO, token: string): Promise<MessageResponseDTO> => {
  try {
    const response = await axios.post(
      API_URL,
      messageDto,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error enviando mensaje:", error);
    throw new Error(error.response?.data?.message || "Error al enviar mensaje");
  }
};

/**
 * Obtiene los mensajes de una conversación con un usuario específico
 */
export const getConversation = async (
  otherUserId: number,
  token: string,
  cursor?: string,
  limit: number = 20
): Promise<PagedMessageResponseDTO> => {
  try {
    const response = await axios.get(
      `${API_URL}/conversation/${otherUserId}/cursor`,
      {
        params: { cursor, limit },
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo conversación:", error);
    throw new Error(error.response?.data?.message || "Error al obtener conversación");
  }
};

/**
 * Obtiene el conteo total de mensajes no leídos
 */
export const countUnreadMessages = async (token: string): Promise<number> => {
  try {
    const response = await axios.get(
      `${API_URL}/unread/count`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo conteo de mensajes no leídos:", error);
    return 0;
  }
};

/**
 * Obtiene el conteo de mensajes no leídos de un remitente específico
 */
export const countUnreadMessagesFromSender = async (senderId: number, token: string): Promise<number> => {
  try {
    const response = await axios.get(
      `${API_URL}/unread/count/${senderId}`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo conteo de mensajes no leídos del remitente:", error);
    return 0;
  }
};

/**
 * Marca como leídos los mensajes de un remitente específico
 */
export const markAsRead = async (senderId: number, token: string): Promise<void> => {
  try {
    await axios.post(
      `${API_URL}/mark-read/${senderId}`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
  } catch (error: any) {
    console.error("Error marcando mensajes como leídos:", error);
    throw new Error(error.response?.data?.message || "Error al marcar mensajes como leídos");
  }
};

/**
 * Obtiene la lista de usuarios con los que el usuario tiene chats
 */
export const getUserChats = async (token: string): Promise<UserDTO[]> => {
  try {
    const response = await axios.get(
      `${API_URL}/chats`,
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    return response.data;
  } catch (error: any) {
    console.error("Error obteniendo chats de usuario:", error);
    throw new Error(error.response?.data?.message || "Error al obtener chats de usuario");
  }
};
