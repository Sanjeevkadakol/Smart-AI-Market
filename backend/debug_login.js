const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function debugLogin() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Jeeva@123',
            database: 'ai_sante'
        });

        const email = 'sanjeevpkadakol1@gmail.com';
        const passwordInput = 'Jeeva@123';

        const [users] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
        const user = users[0];
        console.log("Found User ID:", user?.user_id || "NOT FOUND");

        if (user) {
            const match = await bcrypt.compare(passwordInput, user.password);
            console.log("Password Match result:", match);
        }
        process.exit(0);
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
}
debugLogin();
