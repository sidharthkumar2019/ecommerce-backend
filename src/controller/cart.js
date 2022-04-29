const Cart = require('../models/cart');

function runUpdate(condition, updateData) {
    return new Promise((resolve, reject) => {
        //you update code here

        Cart.findOneAndUpdate(condition, updateData, { upsert: true })
            .then((result) => resolve())
            .catch((err) => reject(err));
    });
}

exports.addItemToCart = async (req, res) => {
    let cart;
    try {
        cart = await Cart.findOne({ user: req.user._id });
    } catch (error) {
        return res.status(400).json({ error });
    }

    if (!cart) {
        cart = new Cart({
            user: req.user._id,
            cartItems: req.body.cartItems
        });
        console.log(cart);

        try {
            await cart.save();
        } catch (error) {
            return res.status(400).json({ message: error.message });
        }

        return res.status(201).json({ message: 'Item was added to cart successfully' });
    }
    else {
        let promiseArray = [];

        req.body.cartItems.forEach((cartItem) => {
            const product = cartItem.product;
            const item = cart.cartItems.find((c) => c.product == product);
            let condition, update;
            if (item) {
                condition = { user: req.user._id, "cartItems.product": product };
                update = {
                    $set: {
                        "cartItems.$": cartItem,
                    },
                };
            } else {
                condition = { user: req.user._id };
                update = {
                    $push: {
                        cartItems: cartItem,
                    },
                };
            }
            promiseArray.push(runUpdate(condition, update));
            //Cart.findOneAndUpdate(condition, update, { new: true }).exec();
            // .exec((error, _cart) => {
            //     if(error) return res.status(400).json({ error });
            //     if(_cart){
            //         //return res.status(201).json({ cart: _cart });
            //         updateCount++;
            //     }
            // })
        });
        Promise.all(promiseArray)
            .then((response) => res.status(201).json({ response }))
            .catch((error) => res.status(400).json({ error }));
    }
};

exports.getCartItems = async (req, res) => {
    let cart;
    try {
        cart = await Cart.findOne({ user: req.user._id })
            .populate({
                path: 'cartItems.product',
                select: '_id name price productPictures'
            });
    } catch (error) {
        console.log(error);
    }

    if (cart) {
        let cartItems = {};
        cart.cartItems.forEach((item, index) => {
            cartItems[item.product._id.toString()] = {
                _id: item.product._id.toString(),
                name: item.product.name,
                img: item.product.productPictures[0].img,
                price: item.product.price,
                qty: item.quantity
            }
        });
        res.status(200).json({ cartItems });
    }
};