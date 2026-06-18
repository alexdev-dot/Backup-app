export interface Notification {
  id: string;
  type: 'message' | 'job' | 'review' | 'payment' | 'system';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

export type NotificationType = Notification['type'];
