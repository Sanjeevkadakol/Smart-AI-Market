const mysql = require('mysql2/promise');

async function checkAdmin() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Jeeva@123',
            database: 'ai_sante'
        });

        const [users] = await db.query(`SELECT user_id, name, email, role FROM users WHERE role = 'cooperative_admin'`);
        console.log(users);
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

checkAdmin();
