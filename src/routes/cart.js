const express = require('express');
const router = express.Router();
const { requireSignin, userMiddleware } = require('../common-moddleware/index');
const { addItemToCart } = require('../controller/cart');

router.post('/user/cart/addtocart', requireSignin, userMiddleware, addItemToCart);

module.exports = router;