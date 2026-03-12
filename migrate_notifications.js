const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });
const db = require('./backend/config/db');

async function migrate() {
    try {
        await db.query(`
            CREATE TABLE IF NOT EXISTS notifications (
                notification_id INT AUTO_INCREMENT PRIMARY KEY,
                user_id INT NOT NULL,
                message TEXT NOT NULL,
                type ENUM('OFFER', 'ORDER', 'SYSTEM') NOT NULL,
                is_read BOOLEAN DEFAULT FALSE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
            )
        `);
        console.log("✅ Notifications table created successfully.");
        process.exit(0);
    } catch (err) {
        console.error("❌ Migration failed:", err);
        process.exit(1);
    }
}

migrate();
