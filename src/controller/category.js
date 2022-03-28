const Category = require('../models/category');
const { default: slugify } = require('slugify');

const createCategoryList = (categories, parentID = null) => {
    const categoryList = [];
    let filteredCategory;
    if ( parentID )
        filteredCategory = categories.filter(x => x.parentID == parentID);
    else    filteredCategory = categories.filter(x => x.parentID == undefined);

    for (let ele of filteredCategory) {
        categoryList.push({
            _id: ele._id,
            name: ele.name,
            slug: ele.slug,
            children: createCategoryList(categories, ele._id)
        });
    }

    return categoryList;
};

exports.addCategory = async(req, res) => {
    if (!req.body.name) return res.status(400).json({message: 'name of the category is required.'});

    let obj = {
        name: req.body.name,
        slug: slugify(req.body.name)
    };
    if (req.body.parentID) obj.parentID = req.body.parentID;

    let category = new Category(obj);
    try {
        category = await category.save();   
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
    
    return res.status(201).json({category});
};

exports.getCategories = async(req, res) => {
    let categories;
    try {
        categories = await Category.find({});
    } catch (error) {
        return res.status(400).json({error: error.message});
    }

    const categoryList = createCategoryList(categories);
    res.status(200).json({categoryList});
};