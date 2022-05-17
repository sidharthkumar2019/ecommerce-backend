const express = require('express');
const { requireSignin, adminMiddleware } = require('../../common-moddleware');
const { updateOrder, getCustomerOrders } = require('../../controller/admin/order');
const router = express.Router();

router.put('/order/update',requireSignin, adminMiddleware, updateOrder);
router.get('/order/getCustomerOrders', requireSignin, adminMiddleware, getCustomerOrders);

module.exports = router;
