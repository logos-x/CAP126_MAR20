let express = require('express');
let router = express.Router();
let productController = require('../controllers/products')
let { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler');
const { check_authorization, check_authentication } = require('../utils/check_auth');
let constant = require('../utils/constants');

router.get('/', async function (req, res, next) {
    let products = await productController.GetAllProduct();
    CreateSuccessRes(res, 200, products);
});

router.get('/:id', async function (req, res, next) {
    try {
        let product = await productController.GetProductById(req.params.id)
        CreateSuccessRes(res, 200, product);
    } catch (error) {
        next(error);
    }
});

router.post('/', check_authentication, check_authorization(constant.MOD_PERMISSION), async function (req, res, next) {
    try {
        let newProduct = await productController.CreateProduct(
            req.body.name,
            req.body.price,
            req.body.quantity,
            req.body.category
        );
        CreateSuccessRes(res, 200, newProduct);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', check_authentication, check_authorization(constant.MOD_PERMISSION), async function (req, res, next) {
    try {
        let updatedProduct = await productController.UpdateProduct(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedProduct);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', check_authentication, check_authorization(constant.ADMIN_PERMISSION), async function (req, res, next) {
    try {
        let deletedProduct = await productController.DeleteProduct(req.params.id);
        CreateSuccessRes(res, 200, deletedProduct);
    } catch (error) {
        next(error);
    }
});

module.exports = router;