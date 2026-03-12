const db = require('./backend/config/db');

async function cleanData() {
    try {
        console.log('Cleaning leading/trailing spaces from state, district, and commodity...');
        await db.query('UPDATE market_prices SET state = TRIM(state), district = TRIM(district), commodity = TRIM(commodity)');
        console.log('✅ DATA CLEANED SUCCESSFULLY');

        console.log('Verifying Karnataka count...');
        const [rows] = await db.query("SELECT COUNT(*) as count FROM market_prices WHERE state = 'Karnataka'");
        console.log('Karnataka records (Clean):', rows[0].count);

        process.exit(0);
    } catch (err) {
        console.error('Error:', err.message);
        process.exit(1);
    }
}

cleanData();
