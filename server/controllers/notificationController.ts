import { Response } from 'express';
import { AuthenticatedRequest } from '../middleware/auth';
import { notificationService, CreateNotificationParams } from '../services/notificationService';
import { dbService } from '../services/dbService';
import { sendSuccess, sendError } from '../utils/response';

export const notificationController = {
  async list(req: AuthenticatedRequest, res: Response) {
    try {
      const notifications = await notificationService.getNotifications(req.organizationId!, req.user?.userId);
      const unreadCount = await dbService.count('notifications', {
        organization_id: req.organizationId!,
        is_read: 0,
      });

      return sendSuccess(res, {
        notifications,
        unreadCount,
      });
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  async markRead(req: AuthenticatedRequest, res: Response) {
    try {
      const id = req.params.id;
      const updated = await notificationService.markAsRead(id, req.organizationId!);
      return sendSuccess(res, updated, 'Notification marked as read.');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  async markAllRead(req: AuthenticatedRequest, res: Response) {
    try {
      await notificationService.markAllAsRead(req.organizationId!);
      return sendSuccess(res, true, 'All notifications marked as read.');
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },

  async create(req: AuthenticatedRequest, res: Response) {
    try {
      const { title, message, category, type, link, scheduledFor, channel } = req.body;
      if (!title || !message) {
        return sendError(res, 'Title and message are required', 400);
      }

      const params: CreateNotificationParams = {
        organizationId: req.organizationId!,
        userId: req.user?.userId,
        title,
        message,
        category: category || 'system',
        type: type || 'reminder',
        link,
        scheduledFor,
        channel: channel || 'in_app',
      };

      const record = await notificationService.notify(params);
      return sendSuccess(res, record, 'Notification dispatched successfully.', 201);
    } catch (err: any) {
      return sendError(res, err.message, 500);
    }
  },
};
