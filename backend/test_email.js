const db = require('./config/db');

async function checkEmail() {
    try {
        const [rows] = await db.query("SELECT * FROM users WHERE email = 'sanjeevpkadako1@gmail.com'");
        console.log("Found:", rows.length, rows);
    } catch (err) {
        console.error("DB Error:", err.message);
    } finally {
        process.exit();
    }
}
checkEmail();
