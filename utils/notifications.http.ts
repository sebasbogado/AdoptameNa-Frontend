import { Notification, NotificationDTO } from '@/types/notification';
import { buildQueryParams, notificationQueryParams, PaginatedResponse } from '@/types/pagination';
import axios from 'axios';

const API_URL = `${process.env.NEXT_PUBLIC_BASE_API_URL}/notifications`;

export const getMyNotifications = async (
  token: string,
  queryParams?: notificationQueryParams
): Promise<PaginatedResponse<Notification>> => {
  try {
    const params = buildQueryParams(queryParams);
    
    const response = await axios.get(
      `${API_URL}/my-notifications`,
      {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener notificaciones");
  }
};

export const getAllNotifications = async (
  token: string,
  queryParams?: notificationQueryParams
): Promise<PaginatedResponse<Notification>> => {
  try {
    const params = buildQueryParams(queryParams);
    
    const response = await axios.get(
      API_URL,
      {
        params,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al obtener notificaciones");
  }
};

export const markNotificationAsRead = async (token: string, id: number): Promise<void> => {
  try {
    await axios.patch(
      `${API_URL}/${id}/mark-as-read`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("Notificación no encontrada");
    }
    throw new Error(error.message || "Error al marcar notificación como leída");
  }
};

export const createNotification = async (
  notificationData: NotificationDTO, 
  token: string
): Promise<Notification> => {
  try {
    const response = await axios.post(
      API_URL,
      notificationData,
      {
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      }
    );

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      throw new Error("No encontrada");
    }
    throw new Error(error.message || "Error al crear notificación");
  }
};