const Category = require('../models/category');
const { default: slugify } = require('slugify');
const shortid = require('shortid');

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
            children: createCategoryList(categories, ele._id),
            parentID: ele.parentID,
            type: ele.type
        });
    }

    return categoryList;
};

exports.addCategory = async(req, res) => {
    if (!req.body.name) return res.status(400).json({message: 'name of the category is required.'});

    let obj = {
        name: req.body.name,
        slug: `${slugify(req.body.name)}-${shortid.generate()}`
    };
    if (req.body.parentID) obj.parentID = req.body.parentID;

    if (req.file) {
        obj.categoryImage = '/public/' + req.file.filename;
    }

    console.log(obj);
    let category = new Category(obj);
    try {
        category = await category.save();   
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
    
    return res.status(201).json(category);
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

exports.updateCategories = async(req, res) => {
    const {_id, name, parentID, type} = req.body;
    const updatedCategories = [];
    if (name instanceof Array) {
        for (let i=0 ; i<name.length ; i++) {
            const category = {
                name: name[i],
                type: type[i]
            }
            if (parentID[i] !== '')
                category.parentID = parentID[i];
            
            const updatedCategory = await Category.findOneAndUpdate({_id: _id[i]}, category, {new: true});
            updatedCategories.push(updatedCategory);
        }
        return res.status(201).json({ updatedCategories });
    }
    else {
        const category = {
            name,
            type
        }
        if (parentID !== '')
            category.parentID = parentID;
        
        const updatedCategory = await Category.findOneAndUpdate({_id}, category, {new: true});
        return res.status(201).json({updatedCategory});
    }
}

exports.deleteCategories = async(req, res) => {
    const { ids } = req.body.payload;
    const deletedCategories = [];
    for (let i=0 ; i<ids.length ; i++) {
        const deletedCategory = await Category.findOneAndDelete({_id: ids[i]._id});
        deletedCategories.push(deletedCategory);
    }  
    if (deletedCategories.length == ids.length)
        res.status(200).json({message: 'Ids have been removed'});
    else 
        res.status(400).json({message: 'Something went wrong'});
};