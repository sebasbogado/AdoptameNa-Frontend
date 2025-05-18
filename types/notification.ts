export enum NotificationType {
  PERSONAL = "PERSONAL",
  ROLE_BASED = "ROLE_BASED",
  GLOBAL = "GLOBAL",
  USER_BASED = "USER_BASED"
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

export interface NotificationResponse {
  content: Notification[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
  first: boolean;
  last: boolean;
}

export interface NotificationDTO {
  title: string;
  message: string;
  type: NotificationType;
  targetUserIds?: number[];
  targetUserId?: number;
  targetRoleIds?: number[];
}