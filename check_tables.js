const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend/.env') });
const db = require('./backend/config/db');

async function check() {
    try {
        const [rows] = await db.query("SHOW TABLES LIKE 'notifications'");
        if (rows.length > 0) {
            console.log("✅ Notifications table exists.");
        } else {
            console.log("❌ Notifications table is MISSING.");
        }
        process.exit(0);
    } catch (err) {
        console.error("❌ Check failed:", err);
        process.exit(1);
    }
}

check();
