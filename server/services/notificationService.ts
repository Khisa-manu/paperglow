import { dbService } from './dbService';

export type NotificationCategory =
  | 'booking'
  | 'chama'
  | 'loan'
  | 'property'
  | 'clinic'
  | 'school'
  | 'legal'
  | 'ticketing'
  | 'business'
  | 'inventory'
  | 'system';

export interface CreateNotificationParams {
  organizationId: number | string;
  userId?: number | string | null;
  title: string;
  message: string;
  category: NotificationCategory;
  type: string;
  link?: string;
  scheduledFor?: string | null;
  channel?: 'in_app' | 'sms' | 'email' | 'whatsapp';
}

export const notificationService = {
  /**
   * Dispatch a notification
   */
  async notify(params: CreateNotificationParams) {
    const record = await dbService.create('notifications', {
      organization_id: params.organizationId,
      user_id: params.userId || null,
      title: params.title,
      message: params.message,
      category: params.category,
      type: params.type,
      link: params.link || null,
      scheduled_for: params.scheduledFor || null,
      channel: params.channel || 'in_app',
      is_read: 0,
    });

    // Configurable external channel dispatch placeholder (SMS, WhatsApp, Email)
    if (params.channel && params.channel !== 'in_app') {
      console.log(`[Notification Service] External ${params.channel.toUpperCase()} dispatch scheduled for ${params.title}`);
    }

    return record;
  },

  /**
   * Get notifications for an organization/user
   */
  async getNotifications(organizationId: number | string, userId?: number | string) {
    return dbService.find('notifications', { organization_id: organizationId }, { orderBy: 'id', orderDirection: 'DESC', limit: 50 });
  },

  /**
   * Mark single notification as read
   */
  async markAsRead(id: number | string, organizationId: number | string) {
    return dbService.update('notifications', id, { is_read: 1 }, organizationId);
  },

  /**
   * Mark all notifications as read for organization
   */
  async markAllAsRead(organizationId: number | string) {
    const unread = await dbService.find('notifications', { organization_id: organizationId, is_read: 0 });
    for (const item of unread) {
      await dbService.update('notifications', item.id, { is_read: 1 }, organizationId);
    }
    return true;
  },
};
