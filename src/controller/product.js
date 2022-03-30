const Product = require('../models/product');
const slugify = require('slugify');

exports.addProduct = async(req, res)=> {
    const {
        name, price, description, category, quantity
    } = req.body;

    let productPictures = [];
    if ( req.files.length > 0 ) {
        productPictures = req.files.map(file => {
            return {img: file.filename};
        });
    }

    let product = new Product({
        name: name,
        slug: slugify(name),
        price,
        quantity,
        description,
        productPictures,
        category,
        createdBy: req.user._id
    });

    try {
        product = await product.save();
    } catch (error) {
        return res.status(400).json({message: error.message});
    }

    res.status(201).send(product);
};