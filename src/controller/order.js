const Order = require('../models/order')
const Cart = require('../models/cart');
const UserAddress = require('../models/address')


exports.addOrder = async (req, res) => {
    let result;
    try {
        result = await Cart.deleteOne({ user: req.user._id })
    } catch (error) {
        console.log(error);
    }
    if (result) {
        req.body.user = req.user._id;
        req.body.orderStatus = [
            {
                type: 'ordered',
                date: new Date(),
                isCompleted: true
            },
            {
                type: 'packed',
                date: new Date(),
                isCompleted: false
            },
            {
                type: 'shipped',
                date: new Date(),
                isCompleted: false
            },
            {
                type: 'delivered',
                date: new Date(),
                isCompleted: false
            },
        ];
        let order = new Order(req.body);
        try {
            order = await order.save();
        } catch (error) {
            return res.status(400).json({ error });
        }
        if (order)
            return res.status(201).json({ order });
        else
            return res.status(400).json({ message: 'order couldn\'t be placed' });
    }
}

exports.getOrders = async (req, res) => {
    let orders;
    try {
        orders = await Order.find({ user: req.user._id })
            .select('_id paymentStatus items')
            .populate({
                path: 'items.productID',
                select: '_id name productPictures'
            });
    } catch (error) {
        return res.status(400).json({ error });
    }
    if (orders)
        return res.status(200).json({ orders });
}

exports.getOrder = async (req, res) => {
    let order;
    try {
        order = await Order.findOne({ _id: req.body.orderID })
            .populate({
                path: 'items.productID',
                select: '_id name productPictures'
            })
            .lean();    // Using this we get a plain js object
    } catch (error) {
        return res.status(400).json({ error });
    }

    if (order) {
        let address;
        try {
            address = await UserAddress.findOne({ user: req.user._id });
        } catch (error) {
            return res.status(400).json({ error });
        }

        if (address) {
            order.address = address.address.find(
                (adr) => adr._id.toString() == order.addressID.toString()
            );
            return res.status(200).json({ order });
        }
    }
    return res.status(400).json({message: 'Unexpected error'});
}