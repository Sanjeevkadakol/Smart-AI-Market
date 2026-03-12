const db = require('../config/db');

// @desc    Confirm an order (from an accepted offer)
// @route   POST /api/orders/confirmOrder
exports.confirmOrder = async (req, res, next) => {
    try {
        const { product_id, buyer_id, final_price, quantity } = req.body;

        // Create order
        const [result] = await db.query(
            'INSERT INTO orders (product_id, buyer_id, final_price, quantity, status) VALUES (?, ?, ?, ?, "pending")',
            [product_id, buyer_id, final_price, quantity]
        );

        // Update sales history for AI training
        const [product] = await db.query('SELECT name FROM products WHERE product_id = ?', [product_id]);
        if (product[0]) {
            const weekNum = Math.ceil(new Date().getDate() / 7); // Simplified week
            await db.query(
                'INSERT INTO sales_history (product_name, week_number, quantity_sold) VALUES (?, ?, ?)',
                [product[0].name, weekNum, quantity]
            );
        }

        res.status(201).json({ success: true, order_id: result.insertId });
    } catch (error) {
        next(error);
    }
};
// @desc    Get orders for the authenticated buyer
// @route   GET /api/orders/my-orders
exports.getUserOrders = async (req, res, next) => {
    try {
        const buyer_id = req.user.id;
        const [orders] = await db.query(`
            SELECT o.*, p.name as product_name, p.region, u.name as farmer_name 
            FROM orders o 
            JOIN products p ON o.product_id = p.product_id 
            JOIN users u ON p.farmer_id = u.user_id 
            WHERE o.buyer_id = ?
            ORDER BY o.created_at DESC
        `, [buyer_id]);
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
};

// @desc    Get sales history for the authenticated farmer
// @route   GET /api/orders/sales-history
exports.getFarmerSales = async (req, res, next) => {
    try {
        const farmer_id = req.user.id;
        const [sales] = await db.query(`
            SELECT o.*, p.name as product_name, p.region, u.name as buyer_name 
            FROM orders o 
            JOIN products p ON o.product_id = p.product_id 
            JOIN users u ON o.buyer_id = u.user_id 
            WHERE p.farmer_id = ?
            ORDER BY o.created_at DESC
        `, [farmer_id]);
        res.json({ success: true, count: sales.length, data: sales });
    } catch (error) {
        next(error);
    }
};
