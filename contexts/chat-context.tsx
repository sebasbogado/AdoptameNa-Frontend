"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ChatContext, ChatContextType } from "../hooks/chat-hooks";
import { MessageResponseDTO, UserDTO, MessageDTO, MarkReadDTO } from "@/types/chat";
import { useChatWebSocket } from "../utils/chat-websocket";
import { useChatMessageSender } from "../hooks/chat-message-sender";
import { 
  countUnreadMessages, 
  getConversation, 
  getUserChats, 
  markAsRead, 
  sendMessage as sendMessageApi 
} from "@/utils/chat.http";

export function ChatProvider({ children }: { children: ReactNode }) {
  const { authToken, user } = useAuth();
  const { sendMessageWs, markAsReadWs } = useChatMessageSender(authToken);
    const [chatUsers, setChatUsers] = useState<UserDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [selectedChat, setSelectedChat] = useState<UserDTO | null>(null);
  const [messages, setMessages] = useState<{ [userId: number]: MessageResponseDTO[] }>({});
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  // Store cursors for each conversation to load older messages
  const [cursors, setCursors] = useState<{ [userId: number]: string | null }>({});
  
  // Función para agregar un nuevo mensaje recibido por WebSocket
  const addNewMessage = useCallback((message: MessageResponseDTO) => {
    console.log("📩 Recibido nuevo mensaje vía WebSocket:", message);
    const { senderId, recipientId } = message;
    const currentUserId = user?.id;
    
    if (!currentUserId) {
      console.warn("No hay usuario actual para procesar el mensaje");
      return;
    }
    
    // Determinar si el mensaje es entrante o saliente
    const targetUserId = senderId === currentUserId ? recipientId : senderId;
    console.log(`Mensaje ${senderId === currentUserId ? "enviado a" : "recibido de"} usuario ID: ${targetUserId}`);
    
    // Agregar el mensaje a la conversación correspondiente
    setMessages(prev => {
      // Importante: Hacemos una copia profunda del array para evitar problemas de referencia
      const conversationMessages = [...(prev[targetUserId] || [])];
      const messageExists = conversationMessages.some(m => m.id === message.id);
      
      if (messageExists) {
        console.log("El mensaje ya existe en la conversación, no se agrega");
        return prev;
      }
      
      console.log(`Agregando mensaje a la conversación con usuario ID: ${targetUserId}`);
      
      // Añadimos el nuevo mensaje AL FINAL del array
      // En React/Next.js con las interfaces de chat, el mensaje más reciente suele aparecer al final
      // y el área se desplaza hacia abajo automáticamente
      const newMessages = [...conversationMessages, message];
      
      return {
        ...prev,
        [targetUserId]: newMessages
      };
    });
    
    // Actualizar la lista de usuarios si es un mensaje de un nuevo usuario
    setChatUsers(prev => {
      const userIndex = prev.findIndex(u => u.id === targetUserId);
      
      if (userIndex === -1) {
        console.log("Usuario no encontrado en la lista de chats, recargando la lista");
        // Si es un nuevo usuario, necesitaremos recargar la lista
        // No llamamos directamente a fetchChatUsers para evitar problemas de dependencia circular
        return prev;
      }
      
      // Solo actualizamos el estado en línea y el contador de mensajes no leídos
      return prev;
    });
    
    // Notificar para actualizar la lista de usuarios si es necesario
    if (senderId !== currentUserId) {
      // Solo recargar usuarios si es un mensaje entrante
      getUserChats(authToken || '').then((users) => {
        if (users) {
          setChatUsers(users);
        }
      }).catch(err => {
        console.error("Error al actualizar la lista de usuarios después de recibir un mensaje:", err);
      });
    }
  }, [user, authToken]);
  
  // Manejar actualizaciones de mensajes no leídos y estado de usuarios
  const handleUnreadUpdate = useCallback((data: any) => {
    if (data.type === 'USER_STATUS_UPDATE') {
      // Actualizar el estado en línea del usuario
      setChatUsers(prev => {
        const updatedUsers = prev.map(u => {
          if (u.id === data.userStatus.userId) {
            return {
              ...u,
              online: data.userStatus.online
            };
          }
          return u;
        });
        return updatedUsers;
      });

      // Actualizar el selectedChat si corresponde al usuario que cambió su estado
      setSelectedChat(prev => {
        if (prev && prev.id === data.userStatus.userId) {
          return {
            ...prev,
            online: data.userStatus.online
          };
        }
        return prev;
      });
    } else {
      // Manejo de mensajes no leídos
      const { senderId, recipientId, unreadCount: senderUnreadCount, totalUnreadCount } = data;
      
      // Actualizar el conteo total de mensajes no leídos
      setUnreadCount(totalUnreadCount);
      
      // Actualizar el conteo de mensajes no leídos del remitente específico
      setChatUsers(prev => {
        const updatedUsers = prev.map(u => {
          if (u.id === senderId) {
            return { ...u, unreadMessagesCount: senderUnreadCount };
          }
          return u;
        });
        
        return updatedUsers;
      });
    }
  }, []);

  // Integración con el WebSocket
  useChatWebSocket(authToken, user, addNewMessage, handleUnreadUpdate);
  
  // Cargar usuarios de chat al inicializar o cambiar el auth token
  useEffect(() => {
    if (authToken && user) {
      fetchChatUsers();
      fetchUnreadCount();
    }
  }, [authToken, user]);
  
  // Obtener usuarios de chat
  const fetchChatUsers = useCallback(async () => {
    if (!authToken) return;
    
    setLoadingUsers(true);
    try {
      const users = await getUserChats(authToken);
      setChatUsers(users);
      
      // Calcular el total de mensajes no leídos
      const total = users.reduce((sum, user) => sum + user.unreadMessagesCount, 0);
      setUnreadCount(total);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [authToken]);
  
  // Obtener conteo de mensajes no leídos
  const fetchUnreadCount = useCallback(async () => {
    if (!authToken) return;
    
    try {
      const count = await countUnreadMessages(authToken);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, [authToken]);
  
  // Seleccionar un chat
  const selectChat = useCallback(async (chatUser: UserDTO) => {
    setSelectedChat(chatUser);
    
    // Cargar mensajes si aún no se han cargado
    if (!messages[chatUser.id] || messages[chatUser.id].length === 0) {
      await loadMoreMessages(chatUser.id);
    }
    
    // Marcar como leídos los mensajes de este remitente
    if (chatUser.unreadMessagesCount > 0 && authToken) {
      await markAsRead(chatUser.id, authToken);
      
      // Actualizar el conteo local después de marcar como leídos
      setChatUsers(prev => {
        return prev.map(u => {
          if (u.id === chatUser.id) {
            return { ...u, unreadMessagesCount: 0 };
          }
          return u;
        });
      });
      
      // Actualizar el conteo total
      setUnreadCount(prev => Math.max(0, prev - chatUser.unreadMessagesCount));
    }
  }, [authToken, messages]);
    // Cargar más mensajes para un chat específico
  const loadMoreMessages = useCallback(async (userId: number, loadOlder: boolean = false) => {
    if (!authToken || !user) return;
    
    // Si estamos cargando mensajes más antiguos, usar el cursor almacenado
    const cursor = loadOlder ? cursors[userId] : undefined;
    
    // Si intentamos cargar mensajes antiguos pero no hay cursor o es null (no hay más mensajes)
    if (loadOlder && cursor === null) {
      console.log("No hay más mensajes antiguos para cargar");
      return;
    }
    
    setLoadingMessages(true);
    try {
      console.log(`Solicitando mensajes para usuario ${userId} ${loadOlder ? 'con cursor: ' + cursor : '(carga inicial)'}`);
      const response = await getConversation(userId, authToken, cursor === null ? undefined : cursor);
      console.log(`Cargados ${response.messages.length} mensajes para la conversación con usuario ${userId}, nextCursor: ${response.nextCursor}`);
      
      // Guardar el cursor para futuras cargas
      setCursors(prev => ({
        ...prev,
        [userId]: response.nextCursor
      }));
      
      // Asegurarse de que los mensajes estén ordenados por fecha
      const sortedResponseMessages = [...response.messages].sort((a, b) => {
        const dateA = new Date(a.sentAt).getTime();
        const dateB = new Date(b.sentAt).getTime();
        return dateA - dateB; // Orden cronológico (más antiguo primero)
      });
      
      setMessages(prev => {
        const existingMessages = [...(prev[userId] || [])];
        
        // Filtrar mensajes duplicados usando sus IDs
        const existingIds = new Set(existingMessages.map(m => m.id));
        const uniqueNewMessages = sortedResponseMessages.filter(msg => !existingIds.has(msg.id));
        
        let updatedMessages;
        
        if (cursor) {
          // Si estamos cargando mensajes más antiguos (con cursor), estos van AL PRINCIPIO
          console.log("Añadiendo mensajes antiguos al principio de la lista");
          updatedMessages = [...uniqueNewMessages, ...existingMessages];
        } else {
          // Primera carga - usar sólo los mensajes del servidor
          console.log("Primera carga de mensajes");
          updatedMessages = sortedResponseMessages;
        }
        
        // Asegurarse de que todos los mensajes estén en orden cronológico
        const allMessagesSorted = updatedMessages.sort((a, b) => {
          const dateA = new Date(a.sentAt).getTime();
          const dateB = new Date(b.sentAt).getTime();
          return dateA - dateB; // Más antiguo primero
        });
        
        return {
          ...prev,
          [userId]: allMessagesSorted
        };
      });
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setLoadingMessages(false);
    }
  }, [authToken, user, cursors]);
    // Enviar un mensaje
  const sendMessage = useCallback(async (content: string, recipientId: number) => {
    if (!authToken || !user?.id) {
      console.error("No se puede enviar el mensaje: falta token o ID de usuario");
      return;
    }
    
    try {
      console.log(`Enviando mensaje al usuario ${recipientId}: ${content.substring(0, 20)}${content.length > 20 ? '...' : ''}`);
      
      const messageDto: MessageDTO = {
        content,
        senderId: user.id,
        recipientId
      };
        // Crear un mensaje temporal para la UI mientras se envía
      // Usar un ID temporal único con formato que no colisione con IDs del servidor
      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const tempMessage: MessageResponseDTO = {
        id: tempId, // ID temporal único que será reemplazado cuando el servidor responda
        content,
        senderId: user.id,
        senderName: user.fullName,
        recipientId: recipientId,
        recipientName: chatUsers.find(u => u.id === recipientId)?.name || "Usuario",
        sentAt: new Date(),
        read: false
      };
      
      // Agregar mensaje a la UI inmediatamente para feedback instantáneo
      setMessages(prev => {
        // Hacer una copia profunda para evitar problemas de referencia
        const conversationMessages = [...(prev[recipientId] || [])];
        
        // Añadir el nuevo mensaje AL FINAL para que aparezca abajo
        return {
          ...prev,
          [recipientId]: [...conversationMessages, tempMessage]
        };
      });
      
      // Intentar enviar primero por WebSocket para mayor velocidad
      console.log("Intentando enviar mensaje por WebSocket...");
      const sentViaWs = sendMessageWs(messageDto);
        // Si falla, intentar por REST API como respaldo
      if (!sentViaWs) {
        console.log("WebSocket failed, sending via REST API instead");
        const response = await sendMessageApi(messageDto, authToken);
        
        // Si tenemos respuesta de la API REST, actualizamos el mensaje en la UI
        if (response) {
          console.log("Mensaje enviado exitosamente vía REST API");
          // Reemplazar el mensaje temporal con el mensaje confirmado
          setMessages(prev => {
            const conversationMessages = [...(prev[recipientId] || [])];
            const updatedMessages = conversationMessages.map(m => 
              m.id === tempMessage.id ? response : m
            );
            // Asegurarse de que los mensajes permanezcan ordenados
            return {
              ...prev,
              [recipientId]: updatedMessages
            };
          });
        }
      } else {
        console.log("Mensaje enviado exitosamente vía WebSocket");
      }
      
      // Para depuración, verificar si tenemos el mensaje en la lista después del envío
      setTimeout(() => {
        setMessages(prev => {
          console.log(`Verificando mensajes para usuario ${recipientId}:`, prev[recipientId]);
          return prev;
        });
      }, 1000);
      
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }, [authToken, user, chatUsers, sendMessageWs]);
    // Marcar un chat como leído
  const markChatAsRead = useCallback(async (senderId: number) => {
    if (!authToken || !user?.id) return;
    
    try {
      await markAsRead(senderId, authToken);
      
      // También enviar a través de WebSocket
      const markReadDto: MarkReadDTO = {
        senderId: senderId,
        recipientId: user.id
      };
      markAsReadWs(markReadDto);
      
      // Actualizar localmente
      setChatUsers(prev => {
        return prev.map(u => {
          if (u.id === senderId) {
            // Restar el conteo de este usuario del total
            setUnreadCount(total => Math.max(0, total - u.unreadMessagesCount));
            return { ...u, unreadMessagesCount: 0 };
          }
          return u;
        });
      });
    } catch (error) {
      console.error("Error marking chat as read:", error);
    }
  }, [authToken, user, markAsReadWs]);
  // Función para verificar si hay más mensajes disponibles para cargar
  const hasMoreMessages = useCallback((userId: number): boolean => {
    return cursors[userId] !== null;
  }, [cursors]);
  
  const chatContextValue: ChatContextType = {
    chatUsers,
    unreadCount,
    selectedChat,
    messages,
    loadingUsers,
    loadingMessages,
    cursors,
    fetchChatUsers,
    selectChat,
    sendMessage,
    loadMoreMessages,
    markChatAsRead,
    hasMoreMessages
  };
  
  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export { useChat } from "../hooks/chat-hooks";
