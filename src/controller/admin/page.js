const Page = require('../../models/page');

exports.createPage = async(req, res) => {
    const {banners, products} = req.files;
    if (banners.length > 0) {
        req.body.banners = banners.map((banner, index) => {
            return {
                img: `${process.env.API}/public/${banner.filename}`,
                navigateTo: `/bannerClicked?categoryID=${req.body.categoryID}&type=${req.body.type}`
            };
        })
    }

    if (products.length > 0) {
        req.body.products = products.map((product, index) => {
            return {
                img: `${process.env.API}/public/${product.filename}`,
                navigateTo: `/productClicked?categoryID=${req.body.categoryID}&type=${req.body.type}`
            };
        })
    }

    req.body.createdBy = req.user._id;

    let page = new Page(req.body);
    page = await page.save();

    if (!page)  return res.status(400).json({message: 'Something went wrong.'});

    res.status(201).json({ page });
};