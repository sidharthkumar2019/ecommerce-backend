const Cart = require('../models/cart');

exports.addItemToCart =  async(req, res) => {
    let cart;
    try {
        cart = await Cart.findOne({user: req.user._id});
    } catch (error) {
        return res.status(400).json({message: error.message});
    }

    if ( !cart ) {
        cart = new Cart({
            user: req.user._id,
            cartItems: [req.body.cartItems]
        });

        try {
            await cart.save();
        } catch (error) {
            return res.status(400).json({message: error.message});
        }
    }
    else {
        const product = cart.cartItems.find(ele => ele.product == req.body.cartItems.product);
        let condition, action;
        if (product) {
            condition = { 'user': req.user._id, 'cartItems.product': req.body.cartItems.product };
            action = {
                "$set": {
                    "cartItems.$": {
                        ...req.body.cartItems,
                        quantity: product.quantity + req.body.cartItems.quantity 
                    }
                }
            };
        }
        else {
            condition = { user: req.user._id };
            action = {
                "$push": {
                    "cartItems": req.body.cartItems
                }
            };
        }

        await Cart.findOneAndUpdate(condition, action);
    }

    return res.status(201).json({message: 'Item was added to cart successfully'});
};