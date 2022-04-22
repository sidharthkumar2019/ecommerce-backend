const express = require('express');
const { requireSignin, adminMiddleware } = require('../common-moddleware/index');
const router = express.Router();
const { addCategory, getCategories, updateCategories } = require('../controller/category');
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

router.post('/category/create', requireSignin, adminMiddleware, upload.single('categoryImage'), addCategory);
router.get('/category/getcategory', getCategories);
router.post('/category/update', upload.array('categoryImage'), updateCategories);

module.exports = router;