import { Request, Response } from "express";
import * as notificationsService from "./notifications.services";

export const getNotifications = async (req: Request, res: Response) => {
  const notifications = await notificationsService.getNotifications(
    req.storeId as string
  );
  res.json(notifications);
};

export const markAsRead = async (req: Request, res: Response) => {
  const notification = await notificationsService.markAsRead(
    req.params.id as string,
    req.storeId as string
  );
  if (!notification) {
    res.status(404).json({ message: "Notification introuvable" });
    return;
  }
  res.json(notification);
};

export const markAllAsRead = async (req: Request, res: Response) => {
  await notificationsService.markAllAsRead(req.storeId as string);
  res.json({ message: "Toutes les notifications marquées comme lues" });
};
