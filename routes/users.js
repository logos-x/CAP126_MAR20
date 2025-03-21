var express = require('express');
var router = express.Router();
let { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')
let UserController = require('../controllers/users')
let jwt = require('jsonwebtoken')
let constant = require('../utils/constants');
const { check_authentication, check_authorization } = require('../utils/check_auth');


// 218060541 - Tran Quang Tai


router.get('/', check_authentication, check_authorization(constant.MOD_PERMISSION), async function (req, res, next) {
    try {
      let users = await userController.GetAllUser();
      CreateSuccessRes(res, 200, users);
    } catch (error) {
      next(error)
    }
});

router.get('/:id', check_authentication, async function (req, res, next) {
  try {
    let userID = req.user.id;
    let currentUser = await UserController.GetUserById(userID);
    if (currentUser.role === constant.ADMIN_PERMISSION || currentUser.id === req.params.id) {
      let user = await UserController.GetUserById(req.params.id);
      CreateSuccessRes(res, 200, user);
    } else {
      CreateErrorRes(res, 403, "You are not authorized to access this resource");
    }
  } catch (error) {
    CreateErrorRes(res, 404, error);
  }
});

router.post('/', check_authentication, check_authorization(constant.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let body = req.body
    let newUser = await UserController.CreateAnUser(body.username, body.password, body.email, body.role);
    CreateSuccessRes(res, 200, newUser);
  } catch (error) {
    next(error);
  }
})

router.put('/:id', check_authentication, check_authorization(constant.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updateUser = await UserController.UpdateUser(req.params.id,req.body);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
})

router.delete('/:id', check_authentication, check_authorization(constant.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updateUser = await userController.DeleteUser(req.params.id);
    CreateSuccessRes(res, 200, updateUser);
  } catch (error) {
    next(error);
  }
})


module.exports = router;
