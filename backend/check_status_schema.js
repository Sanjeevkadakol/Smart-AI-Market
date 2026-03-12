const db = require('./config/db');

async function checkSchema() {
    try {
        const [rows] = await db.query("SHOW COLUMNS FROM orders LIKE 'status'");
        console.log("STATUS COLUMN:", rows[0]);
        process.exit(0);
    } catch (error) {
        console.error("ERROR:", error);
        process.exit(1);
    }
}
checkSchema();
