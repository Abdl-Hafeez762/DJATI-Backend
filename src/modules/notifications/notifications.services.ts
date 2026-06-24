import Notification from "./notifications.models";

export const getNotifications = (storeId: string) => {
  return Notification.find({ storeId }).sort({ createdAt: -1 });
};

export const markAsRead = (id: string, storeId: string) => {
  return Notification.findOneAndUpdate(
    { _id: id, storeId },
    { read: true },
    { new: true }
  );
};

export const markAllAsRead = (storeId: string) => {
  return Notification.updateMany({ storeId, read: false }, { read: true });
};
