const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const orderRoutes = require('./routes/orders');
const menuRoutes = require('./routes/menu');
const errorHandler = require('./middleware/errorHandler');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Koneksi MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Routes
app.use('/api/orders', orderRoutes);
app.use('/api/menu', menuRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ message: 'Shel-A Side API is running 🔥' });
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`Server berjalan di port ${PORT}`);
});
