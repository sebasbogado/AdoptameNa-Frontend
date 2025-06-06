"use client";

import { ReactNode, useCallback, useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ChatContext, ChatContextType } from "../hooks/chat-hooks";
import {
  MessageResponseDTO,
  UserDTO,
  MessageDTO,
  MarkReadDTO,
} from "@/types/chat";
import { ImagePreview } from "@/hooks/use-chat-image-upload";
import { useChatWebSocket } from "../utils/chat-websocket";
import { useChatMessageSender } from "../hooks/chat-message-sender";
import {
  countUnreadMessages,
  getConversation,
  getUserChats,
  markAsRead,
  sendMessage as sendMessageApi,
} from "@/utils/chat.http";

export function ChatProvider({ children }: { children: ReactNode }) {
  const { authToken, user } = useAuth();
  const { sendMessageWs, markAsReadWs } = useChatMessageSender(authToken);
  const [chatUsers, setChatUsers] = useState<UserDTO[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [selectedChat, setSelectedChat] = useState<UserDTO | null>(null);
  const [messages, setMessages] = useState<{
    [userId: number]: MessageResponseDTO[];
  }>({});
  const [loadingUsers, setLoadingUsers] = useState<boolean>(false);
  const [loadingMessages, setLoadingMessages] = useState<boolean>(false);
  const [cursors, setCursors] = useState<{ [userId: number]: string | null }>(
    {}
  );

  const addNewMessage = useCallback(
    (message: MessageResponseDTO) => {
      const { senderId, recipientId } = message;
      const currentUserId = user?.id;

      if (!currentUserId) {
        return;
      }

      const targetUserId = senderId === currentUserId ? recipientId : senderId;

      setMessages((prev) => {
        const conversationMessages = [...(prev[targetUserId] || [])];
        const messageExists = conversationMessages.some(
          (m) => m.id === message.id
        );

        if (messageExists) {
          return prev;
        }

        return {
          ...prev,
          [targetUserId]: [...conversationMessages, message],
        };
      });

      setChatUsers((prev) => {
        const existingUser = prev.find((u) => u.id === targetUserId);
        if (!existingUser) {
          const newUser: UserDTO = {
            id: targetUserId,
            name:
              senderId === currentUserId
                ? message.recipientName
                : message.senderName,
            email: "",
            online: false,
            unreadMessagesCount: senderId === currentUserId ? 0 : 1,
          };
          return [...prev, newUser];
        }

        if (senderId !== currentUserId) {
          return prev.map((u) =>
            u.id === targetUserId
              ? { ...u, unreadMessagesCount: u.unreadMessagesCount + 1 }
              : u
          );
        }
        return prev;
      });

      if (authToken) {
        getUserChats(authToken)
          .then((users) => {
            if (users) {
              setChatUsers(users);
            }
          })
          .catch((err) => {
            console.error(
              "Error updating chat users after receiving message:",
              err
            );
          });
      }
    },
    [user, authToken]
  );

  const handleUnreadUpdate = useCallback((data: any) => {
    if (data.type === "USER_STATUS_UPDATE") {
      setChatUsers((prev) => {
        const updatedUsers = prev.map((u) => {
          if (u.id === data.userStatus.userId) {
            return {
              ...u,
              online: data.userStatus.online,
            };
          }
          return u;
        });
        return updatedUsers;
      });

      setSelectedChat((prev) => {
        if (prev && prev.id === data.userStatus.userId) {
          return {
            ...prev,
            online: data.userStatus.online,
          };
        }
        return prev;
      });
    } else {
      const {
        senderId,
        recipientId,
        unreadCount: senderUnreadCount,
        totalUnreadCount,
      } = data;

      setUnreadCount(totalUnreadCount);

      setChatUsers((prev) => {
        const updatedUsers = prev.map((u) => {
          if (u.id === senderId) {
            return { ...u, unreadMessagesCount: senderUnreadCount };
          }
          return u;
        });

        return updatedUsers;
      });
    }
  }, []);

  useChatWebSocket(authToken, user, addNewMessage, handleUnreadUpdate);

  useEffect(() => {
    if (authToken && user) {
      fetchChatUsers();
      fetchUnreadCount();
    }
  }, [authToken, user]);

  const fetchChatUsers = useCallback(async () => {
    if (!authToken) return;

    setLoadingUsers(true);
    try {
      const users = await getUserChats(authToken);
      setChatUsers(
        users.map((user) => ({
          ...user,
          online: user.online || false,
        }))
      );

      const total = users.reduce(
        (sum, user) => sum + user.unreadMessagesCount,
        0
      );
      setUnreadCount(total);
    } catch (error) {
      console.error("Error fetching chat users:", error);
    } finally {
      setLoadingUsers(false);
    }
  }, [authToken]);

  const fetchUnreadCount = useCallback(async () => {
    if (!authToken) return;

    try {
      const count = await countUnreadMessages(authToken);
      setUnreadCount(count);
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  }, [authToken]);

  const selectChat = useCallback(
    async (chatUser: UserDTO) => {
      setSelectedChat(chatUser);

      if (!messages[chatUser.id] || messages[chatUser.id].length === 0) {
        await loadMoreMessages(chatUser.id);
      }

      if (chatUser.unreadMessagesCount > 0 && authToken) {
        await markAsRead(chatUser.id, authToken);

        setChatUsers((prev) => {
          return prev.map((u) => {
            if (u.id === chatUser.id) {
              return { ...u, unreadMessagesCount: 0 };
            }
            return u;
          });
        });

        setUnreadCount((prev) =>
          Math.max(0, prev - chatUser.unreadMessagesCount)
        );
      }
    },
    [authToken, messages]
  );

  const loadMoreMessages = useCallback(
    async (userId: number, loadOlder: boolean = false) => {
      if (!authToken || !user) return;

      const cursor = loadOlder ? cursors[userId] : undefined;

      if (loadOlder && cursor === null) {
        return;
      }

      setLoadingMessages(true);
      try {
        const response = await getConversation(
          userId,
          authToken,
          cursor === null ? undefined : cursor
        );

        setCursors((prev) => ({
          ...prev,
          [userId]: response.nextCursor,
        }));

        const sortedResponseMessages = [...response.messages].sort((a, b) => {
          const dateA = new Date(a.sentAt).getTime();
          const dateB = new Date(b.sentAt).getTime();
          return dateA - dateB;
        });

        setMessages((prev) => {
          const existingMessages = [...(prev[userId] || [])];

          const existingIds = new Set(existingMessages.map((m) => m.id));
          const uniqueNewMessages = sortedResponseMessages.filter(
            (msg) => !existingIds.has(msg.id)
          );

          let updatedMessages;

          if (cursor) {
            updatedMessages = [...uniqueNewMessages, ...existingMessages];
          } else {
            updatedMessages = sortedResponseMessages;
          }

          const allMessagesSorted = updatedMessages.sort((a, b) => {
            const dateA = new Date(a.sentAt).getTime();
            const dateB = new Date(b.sentAt).getTime();
            return dateA - dateB;
          });

          return {
            ...prev,
            [userId]: allMessagesSorted,
          };
        });
      } catch (error) {
        console.error("Error loading messages:", error);
      } finally {
        setLoadingMessages(false);
      }
    },
    [authToken, user, cursors]
  );
  const sendMessage = useCallback(
    async (content: string, recipientId: number, mediaIds?: number[], images?: ImagePreview[]) => {
      if (!authToken || !user?.id) {
        console.error(
          "No se puede enviar el mensaje: falta token o ID de usuario"
        );
        return;
      }

      const tempId = `temp_${Date.now()}_${Math.random()
        .toString(36)
        .substring(2, 9)}`;

      try {
        const messageDto: MessageDTO = {
          content,
          senderId: user.id,
          recipientId,
          mediaIds,
        };

        const tempMediaArray = images ? images.map(image => ({
          id: image.id,
          url: image.url,
          mimeType: image.mimeType,
          userId: user.id,
          uploadDate: new Date().toISOString()
        })) : [];

        const tempMessage: MessageResponseDTO = {
          id: tempId,
          content,
          senderId: user.id,
          senderName: user.fullName,
          recipientId: recipientId,
          recipientName:
            chatUsers.find((u) => u.id === recipientId)?.name || "Usuario",
          sentAt: new Date(),
          read: false,
          media: tempMediaArray,
        };

        setMessages((prev) => {
          const conversationMessages = [...(prev[recipientId] || [])];
          return {
            ...prev,
            [recipientId]: [...conversationMessages, tempMessage],
          };
        });

        // Try WebSocket first, then fallback to HTTP
        const sentViaWs = sendMessageWs(messageDto);
        if (!sentViaWs) {
          const response = await sendMessageApi(messageDto, authToken);

          if (response) {
            // Replace temp message with real message from server
            setMessages((prev) => {
              const conversationMessages = [...(prev[recipientId] || [])];
              const updatedMessages = conversationMessages.map((m) =>
                m.id === tempId ? response : m
              );
              return {
                ...prev,
                [recipientId]: updatedMessages,
              };
            });
          }
        }      } catch (error) {
        console.error("Error sending message:", error);
        // Remove temp message on error
        setMessages((prev) => {
          const conversationMessages = [...(prev[recipientId] || [])];
          const filteredMessages = conversationMessages.filter(m => m.id !== tempId);
          return {
            ...prev,
            [recipientId]: filteredMessages,
          };
        });
      }
    },
    [authToken, user, chatUsers, sendMessageWs]
  );

  const markChatAsRead = useCallback(
    async (senderId: number) => {
      if (!authToken || !user?.id) return;

      try {
        await markAsRead(senderId, authToken);

        const markReadDto: MarkReadDTO = {
          senderId: senderId,
          recipientId: user.id,
        };
        markAsReadWs(markReadDto);

        setChatUsers((prev) => {
          return prev.map((u) => {
            if (u.id === senderId) {
              setUnreadCount((total) =>
                Math.max(0, total - u.unreadMessagesCount)
              );
              return { ...u, unreadMessagesCount: 0 };
            }
            return u;
          });
        });
      } catch (error) {
        console.error("Error marking chat as read:", error);
      }
    },
    [authToken, user, markAsReadWs]
  );

  const hasMoreMessages = useCallback(
    (userId: number): boolean => {
      return cursors[userId] !== null;
    },
    [cursors]
  );

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
    hasMoreMessages,
    setChatUsers,
  };

  return (
    <ChatContext.Provider value={chatContextValue}>
      {children}
    </ChatContext.Provider>
  );
}

export { useChat } from "../hooks/chat-hooks";
