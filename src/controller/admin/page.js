const Page = require('../../models/page');

exports.createPage = async(req, res) => {

    const {banners, products} = req.files;
    if (banners.length > 0) {
        req.body.banners = banners.map((banner, index) => {
            return {
                img: `/public/${banner.filename}`,
                navigateTo: `/bannerClicked?categoryID=${req.body.category}&type=${req.body.type}`
            };
        })
    }

    if (products.length > 0) {
        req.body.products = products.map((product, index) => {
            return {
                img: `/public/${product.filename}`,
                navigateTo: `/productClicked?categoryID=${req.body.category}&type=${req.body.type}`
            };
        })
    }

    req.body.createdBy = req.user._id;

    let page;
    try {
        page = await Page.findOne({category: req.body.category});
    } catch (error) {
        return res.status(400).json({ error });
    }
    
    if (page) {
        try {
            page = await Page.findOneAndUpdate({category: req.body.category});
        } catch (error) {
            return res.status(400).json({error});
        }
        if (page)
            return res.status(201).json({page});
    }
    else {
        page = new Page(req.body);

        try {
            page = await page.save();
        } catch (error) {
            return res.status(400).json({error});
        }
        if (page)
            res.status(201).json({ page });
    }
};

exports.getPage = async(req, res) => {
    const {category, type} = req.params;
    if (type == 'page') {
        let page;
        try {
            page = await Page.findOne({category: category});
        } catch (error) {
            return res.status(400).json({error});
        }
        if (page) 
            return res.status(200).json({page});
    }
};