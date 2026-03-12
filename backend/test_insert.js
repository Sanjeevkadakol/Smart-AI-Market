const db = require('./config/db');

async function testInsert() {
    try {
        const [result] = await db.query(
            "INSERT INTO users (name, email, password, role) VALUES ('Test', 'test@example.com', 'test', 'cooperative_admin')"
        );
        console.log("Success", result);
    } catch (err) {
        console.error("DB Error:", err.message);
    } finally {
        process.exit();
    }
}
testInsert();
