const mysql = require('mysql2/promise');
const bcrypt = require('bcryptjs');

async function updateAdmin() {
    try {
        const db = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: 'Jeeva@123',
            database: 'ai_sante'
        });

        const name = 'Sanjeev';
        const email = 'sanjeevpkadakol1@gmail.com';
        const passwordText = 'Jeeva@123';

        console.log('Generating salt and hashing password...');
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(passwordText, salt);

        console.log('Removing old admins...');
        await db.query(`DELETE FROM users WHERE role = 'cooperative_admin'`);

        console.log('Inserting new admin...');
        await db.query(
            `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'cooperative_admin')`,
            [name, email, passwordHash]
        );

        console.log('✅ Updated!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error updating credentials:', err);
        process.exit(1);
    }
}

updateAdmin();
