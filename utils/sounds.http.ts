"use client";

import { MediaDTO } from "@/types/user-profile";
import axios from "axios";


const API_URL = process.env.NEXT_PUBLIC_BASE_API_URL || "http://localhost:8080/api";
const MEDIA_API_URL = `${API_URL}/media`;

export const getSounds = async (token: string | null): Promise<{
  notificationSound: MediaDTO | null;
  messageSound: MediaDTO | null;
}> => {
  if (!token) {
    console.error("No se puede obtener sonidos: falta token");
    return { notificationSound: null, messageSound: null };
  }

  try {
    const [notificationRes, messageRes] = await Promise.all([
      axios.get(`${MEDIA_API_URL}/notification-sound`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
      axios.get(`${MEDIA_API_URL}/message-sound`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
    ]);

    return {
      notificationSound: notificationRes.data,
      messageSound: messageRes.data,
    };
  } catch (error) {
    console.error("Error al obtener sonidos:", error);
    return { notificationSound: null, messageSound: null };
  }
};
