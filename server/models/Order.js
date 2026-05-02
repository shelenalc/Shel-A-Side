const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    qty: { type: Number, required: true, default: 1 },
    sauce: { type: String, default: '' },
    image: { type: String, default: '' }
});

const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    items: [orderItemSchema],
    total: { type: Number, required: true },
    note: { type: String, default: '' },
    paymentMethod: { type: String, enum: ['QRIS', 'GoPay', 'OVO', 'Cash', 'Transfer'], default: 'Cash' },
    status: { type: String, enum: ['pending', 'confirmed', 'preparing', 'done', 'cancelled'], default: 'pending' },
    tableNumber: { type: String, default: '' },
    orderType: { type: String, enum: ['dine-in', 'takeaway', 'delivery'], default: 'dine-in' }
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
