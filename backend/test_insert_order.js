const db = require('./config/db');

async function testInsert() {
    try {
        console.log("🚀 Testing single order insert...");
        
        const [result] = await db.query(
            'INSERT INTO orders (product_id, buyer_id, final_price, quantity, status) VALUES (?, ?, ?, ?, ?)',
            [89, 18, 100.00, 10, 'shipped']
        );
        
        console.log("✅ Success! Insert ID:", result.insertId);
        process.exit(0);
    } catch (error) {
        console.error("❌ Error:", error);
        process.exit(1);
    }
}

testInsert();
