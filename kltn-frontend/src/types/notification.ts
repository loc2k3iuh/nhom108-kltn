export enum NotificationType {
  CALENDAR = 'CALENDAR',
  ORDER = 'ORDER',
  PRODUCT = 'PRODUCT',
  PROMOTION = 'PROMOTION',
  SYSTEM = 'SYSTEM'
}

export interface NotificationResponseDTO {
  id: number;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
  type: NotificationType;
  originalType: string;
}
