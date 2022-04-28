const Product = require('../models/product');
const slugify = require('slugify');
const Category = require('../models/category');

exports.addProduct = async (req, res) => {
    const {
        name, price, description, category, quantity
    } = req.body;

    let productPictures = [];
    if (req.files.length > 0) {
        productPictures = req.files.map(file => {
            return { img: file.filename };
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
        return res.status(400).json({ message: error.message });
    }

    res.status(201).send(product);
};

exports.getProductsBySlug = async (req, res) => {
    const { slug } = req.params;
    let category;
    try {
        category = await Category
            .findOne({ slug: slug })
            .select('_id');
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

    if (!category)
        return res.status(404).json({ message: 'No such category.' });

    let products;
    try {
        products = await Product.find({ category: category._id });
    } catch (error) {
        return res.status(400).json({ message: error.message });
    }

    if (products.length > 0) {
        res.status(200).json({
            products,
            productsByPrice: {
                under5k: products.filter(product => product.price < 5000),
                under10k: products.filter(product => product.price < 10000 && product.price >= 5000),
                under10k: products.filter(product => product.price < 10000 && product.price >= 5000),
                under15k: products.filter(product => product.price < 15000 && product.price >= 10000),
                under20k: products.filter(product => product.price < 20000 && product.price >= 15000),
                under30k: products.filter(product => product.price < 30000 && product.price >= 20000),
            }
        });
    }
}

exports.getProductDetailsById = async (req, res) => {
    const { productID } = req.params;

    if (productID) {
        let product;
        try {
            product = await Product.findOne({ _id: productID });
        } catch (error) {
            console.log(error);
            return res.status(500).json({error});
        }

        if (product)
            res.status(200).json({ product });
        else
            res.status(400).json({ message: 'No such product found.' });
    }
    else {
        return res.status(400).json({ error: "Params required" });
    }
}