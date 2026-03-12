const db = require('./backend/config/db');

async function optimizeDB() {
    try {
        console.log('Adding indexes to market_prices...');
        await db.query('CREATE INDEX idx_commodity ON market_prices(commodity)');
        await db.query('CREATE INDEX idx_state ON market_prices(state)');
        await db.query('CREATE INDEX idx_district ON market_prices(district)');
        console.log('✅ INDEXES ADDED SUCCESSFULLY');
        process.exit(0);
    } catch (err) {
        if (err.message.includes('Duplicate key')) {
            console.log('⚠️ Indexes already exist.');
        } else {
            console.error('Error:', err.message);
        }
        process.exit(0);
    }
}

optimizeDB();
