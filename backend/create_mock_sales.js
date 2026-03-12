const db = require('./config/db');

async function createMockSales() {
    try {
        console.log("🚀 Starting mock sales generation...");
        
        // Data for the demo
        const demoSales = [
            {
                product_id: 89, // Groundnuts
                buyer_id: 18,   // Saha
                final_price: 2400.00,
                quantity: 40,
                status: 'completed'
            },
            {
                product_id: 91, // Tomatoes (assuming)
                buyer_id: 18,
                final_price: 850.00,
                quantity: 25,
                status: 'completed'
            },
            {
                product_id: 89,
                buyer_id: 18,
                final_price: 1200.00,
                quantity: 20,
                status: 'pending'
            }
        ];

        for (const sale of demoSales) {
            await db.query(
                'INSERT INTO orders (product_id, buyer_id, final_price, quantity, status) VALUES (?, ?, ?, ?, ?)',
                [sale.product_id, sale.buyer_id, sale.final_price, sale.quantity, sale.status]
            );
            console.log(`✅ Inserted sale for product ID ${sale.product_id}`);
        }

        console.log("💎 Mock sales generation complete!");
        process.exit(0);
    } catch (error) {
        console.error("❌ Error generating mock sales:", error);
        process.exit(1);
    }
}

createMockSales();
