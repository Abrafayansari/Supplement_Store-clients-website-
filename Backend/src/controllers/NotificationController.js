import { prisma } from "../config/db.js";

// Get all notifications for admin
export const getNotifications = async (req, res) => {
    try {
        const notifications = await prisma.notification.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });

        return res.status(200).json({
            success: true,
            notifications,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch notifications" });
    }
};

// Get unread notification count
export const getUnreadCount = async (req, res) => {
    try {
        const count = await prisma.notification.count({
            where: { isRead: false },
        });

        return res.status(200).json({
            success: true,
            count,
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch notification count" });
    }
};

// Mark notification as read and delete it
export const markAsReadAndDelete = async (req, res) => {
    try {
        const { notificationId } = req.params;

        // Check if notification exists
        const notification = await prisma.notification.findUnique({
            where: { id: notificationId },
        });

        if (!notification) {
            return res.status(404).json({ error: "Notification not found" });
        }

        // Delete the notification
        await prisma.notification.delete({
            where: { id: notificationId },
        });

        return res.status(200).json({
            success: true,
            message: "Notification deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete notification" });
    }
};

// Delete all notifications
export const deleteAllNotifications = async (req, res) => {
    try {
        await prisma.notification.deleteMany({});

        return res.status(200).json({
            success: true,
            message: "All notifications deleted successfully",
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to delete notifications" });
    }
};
