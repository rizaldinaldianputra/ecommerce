export interface NotificationHistory {
  id: number;
  userId: number | null;
  title: string;
  body: string;
  type: string;
  isRead: boolean;
  dataPayload?: string;
  createdAt: string;
}

export interface PushNotificationRequest {
  title: string;
  body: string;
  type: string;
  userId?: string;
  topic?: string;
}
