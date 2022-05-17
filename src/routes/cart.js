const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../common-moddleware/index');
const { addItemToCart, getCartItems, removeCartItems } = require('../controller/cart');

router.post('/user/cart/addtocart', requireSignin, userMiddleware, addItemToCart);
router.post('/user/getCartItems', requireSignin, userMiddleware, getCartItems);
router.put('/user/cart/removeItem', requireSignin, userMiddleware, removeCartItems);

module.exports = router;