const db = require('../config/db');

// @desc    Get all notifications for the authenticated user
// @route   GET /api/notifications
exports.getNotifications = async (req, res, next) => {
    try {
        const user_id = req.user.id;
        const [notifications] = await db.query(
            'SELECT * FROM notifications WHERE user_id = ? ORDER BY created_at DESC LIMIT 20',
            [user_id]
        );
        res.json({ success: true, count: notifications.length, data: notifications });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark a notification as read
// @route   PATCH /api/notifications/:id
exports.markAsRead = async (req, res, next) => {
    try {
        const { id } = req.params;
        await db.query('UPDATE notifications SET is_read = TRUE WHERE notification_id = ?', [id]);
        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        next(error);
    }
};

// Helper function to create notification (internal use)
exports.createNotification = async (user_id, message, type) => {
    try {
        await db.query(
            'INSERT INTO notifications (user_id, message, type) VALUES (?, ?, ?)',
            [user_id, message, type]
        );
        return true;
    } catch (error) {
        console.error("Error creating notification:", error);
        return false;
    }
};
