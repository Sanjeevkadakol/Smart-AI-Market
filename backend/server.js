const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const errorHandler = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/market', require('./routes/marketRoutes'));
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/offers', require('./routes/offerRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/cooperatives', require('./routes/cooperativeRoutes'));
app.use('/api/ai', require('./routes/aiRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));



app.get('/api/health', (req, res) => {
    res.json({ status: 'up', message: 'AI Sante API is healthy' });
});

// Error Handling
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});
