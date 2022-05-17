const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    addressID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'UserAddress.address',
        required: true
    },
    totalAmount: {
        type: Number,
        required: true
    },
    items: [
        {
            productID: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            payablePrice: {
                type: Number,
                required: true
            },
            purchasedQty: {
                type: Number,
                required: true
            }
        }
    ],
    paymentStatus: {
        type: String,
        enum: ['pending', 'completed', 'cancelled', 'refund'],
        required: true
    },
    paymentType: {
        type: String,
        enum: ['cod', 'card'],
        required: true
    },
    orderStatus: [
        {
            type: {
                type: String,
                enum: ['ordered', 'packed', 'shipped', 'delivered'],
                default: 'ordered'
            },
            date: Date,
            isCompleted: {
                type: Boolean,
                default: false
            }
        },
    ]
}, {timestamps: true});

module.exports = mongoose.model('Order', orderSchema);