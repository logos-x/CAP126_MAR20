var express = require('express');
var router = express.Router();
let categoryController = require('../controllers/categories')
let { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')
let { check_authentication, check_authorization } = require('../utils/check_auth');
let constant = require('../utils/constants');

router.get('/', async function (req, res, next) {
    let categories = await categoryController.GetAllCategory();
    CreateSuccessRes(res, 200, categories);
});

router.get('/:id', async function (req, res, next) {
    try {
        let category = await categoryController.GetCategoryById(req.params.id)
        CreateSuccessRes(res, 200, category);
    } catch (error) {
        next(error);
    }
});

router.post('/', check_authentication, check_authorization(constant.MOD_PERMISSION), async function (req, res, next) {
    try {
        let newCategory = await categoryController.CreateCategory(req.body.name);
        CreateSuccessRes(res, 200, newCategory);
    } catch (error) {
        next(error);
    }
});

router.put('/:id', check_authentication, check_authorization(constant.MOD_PERMISSION), async function (req, res, next) {
    try {
        let updatedCategory = await categoryController.UpdateCategory(req.params.id, req.body);
        CreateSuccessRes(res, 200, updatedCategory);
    } catch (error) {
        next(error);
    }
});

router.delete('/:id', check_authentication, check_authorization(constant.ADMIN_PERMISSION), async function (req, res, next) {
    try {
        let deletedCategory = await categoryController.DeleteCategory(req.params.id);
        CreateSuccessRes(res, 200, deletedCategory);
    } catch (error) {
        next(error);
    }
});

module.exports = router;