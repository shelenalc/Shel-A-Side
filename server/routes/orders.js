const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST /api/orders
router.post('/', async (req, res, next) => {
    try {
        const { customerName, items, total, note, paymentMethod, tableNumber, orderType } = req.body;
        if (!customerName || !items || items.length === 0 || !total) {
            return res.status(400).json({ error: 'Data tidak lengkap' });
        }

        const order = await Order.create({
            customerName,
            items,
            total,
            note,
            paymentMethod: paymentMethod || 'Cash',
            tableNumber: tableNumber || '',
            orderType: orderType || 'dine-in'
        });

        res.status(201).json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
});

// GET /api/orders
router.get('/', async (req, res, next) => {
    try {
        const orders = await Order.find().sort({ createdAt: -1 });
        res.json({ success: true, count: orders.length, data: orders });
    } catch (error) {
        next(error);
    }
});

// GET /api/orders/:id
router.get('/:id', async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) {
            return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
});

// PATCH /api/orders/:id
router.patch('/:id', async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findByIdAndUpdate(req.params.id, { status }, { new: true, runValidators: true });
        if (!order) {
            return res.status(404).json({ error: 'Pesanan tidak ditemukan' });
        }
        res.json({ success: true, data: order });
    } catch (error) {
        next(error);
    }
});

module.exports = router;
