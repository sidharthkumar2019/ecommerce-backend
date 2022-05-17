const Order = require("../../models/order");

exports.updateOrder = async (req, res) => {
    let order;
    try {
        order = await Order.updateOne(
            { _id: req.body.orderID, 'orderStatus.type': req.body.type },
            {
                $set: {
                    'orderStatus.$': [
                        {
                            type: req.body.type,
                            data: new Date(),
                            isCompleted: true
                        }
                    ],
                },
            }
        );
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: error.message });
    }

    if (order)
        return res.status(201).json({ order });
}

exports.getCustomerOrders = async (req, res) => {
    let orders = [];
    try {
        orders = await Order.find({}).populate({
            path: 'items.productID',
            select: 'name'
        });
    } catch (error) {
        return res.status(400).json({ error });
    }
    if (orders) {
        return res.status(200).json({ orders });
    }
}