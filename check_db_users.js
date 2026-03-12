const mysql = require('mysql2/promise');
const dotenv = require('dotenv');

dotenv.config({ path: './backend/.env' });

async function checkUsers() {
    const conn = await mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME
    });

    const [users] = await conn.query("SELECT user_id, name, role FROM users");
    console.log(JSON.stringify(users, null, 2));
    await conn.end();
}

checkUsers();
