var express = require('express');
var router = express.Router();
let productController = require('../controllers/products')
let { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');

router.get('/:category', async function (req, res, next) {
    try {
        let products = await productController.GetAllProductByCategorySlug(req.params.category);
        if (!products) {
            return CreateErrorRes(res, 404, "Category not found");
        }
        if (products.length === 0) {
            return CreateErrorRes(res, 404, "No products found in this category");
        }
        CreateSuccessRes(res, 200, products);
    } catch (error) {
        next(error);
    }
});

router.get('/:category/:product', async function (req, res, next) {
    try {
        let category = await productController.GetAllProductByCategorySlug(req.params.category);
        if (!category) {
            return CreateErrorRes(res, 404, "Category not found");
        }
        if (category.length === 0) {
            return CreateErrorRes(res, 404, "No products found in this category");
        }
        let product = category.find(item => item.slug === req.params.product);
        if (!product) {
            return CreateErrorRes(res, 404, "Product not found");
        }
        CreateSuccessRes(res, 200, product);
    } catch (error) {
        next(error);
    }
});

module.exports = router;