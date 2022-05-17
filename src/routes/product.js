const express = require('express');
const router = express.Router();
const { requireSignin, adminMiddleware } = require('../common-moddleware/index');
const { addProduct, getProductsBySlug, getProductDetailsById, getProducts, deleteProductByID } = require('../controller/product');
const multer  = require('multer');
const path = require('path');
const shortid = require('shortid');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, path.join(path.dirname(__dirname), 'uploads'));
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, shortid.generate()+'-'+file.originalname);
    }
});
  
const upload = multer({ storage: storage });

router.post('/product/create', requireSignin, adminMiddleware, upload.array('productPicture'), addProduct);
router.get('/products/:slug', getProductsBySlug);
router.get('/product/getProducts', getProducts);
router.get('/product/:productID', getProductDetailsById);
router.post('/product/deleteProductByID', requireSignin, adminMiddleware, deleteProductByID);

module.exports = router;