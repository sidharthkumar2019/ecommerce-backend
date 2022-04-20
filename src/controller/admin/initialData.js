const Product = require('../../models/product');
const Category = require('../../models/category');

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
            parentID: ele.parentID
        });
    }

    return categoryList;
};

exports.initalData = async(req, res) => {
    const categories = await Category.find({});     
    const products = await Product.find({})
                                .select('_id name category price quantity slug description productPictures')
                                .populate({
                                    path: 'category',
                                    select: '_id name'
                                });

    res.status(200).json({
        categories: createCategoryList(categories),
        products
    });
};