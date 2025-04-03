let {body, validationResult} = require('express-validator');
const { ERROR_USERNAME, ERROR_EMAIL, ERROR_PASSWORD, ERROR_SIGNIN } = require('./constants');
let util = require('util');
let constants = require('./constants');
let { CreateSuccessRes, CreateErrorRes } = require('../utils/ResHandler')

let options = {
    password: {
        minLength: 8,
        minLowercase: 1,
        minUppercase: 1,
        minNumbers: 1,
        minSymbols: 1
    }
}

module.exports = {
    validate: function (req, res, next) {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
            CreateErrorRes(res, 404, errors.array());
        } else {
            next();
        }
    },
    validationSignUp: [
            body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
            body("password").isStrongPassword(options.password).withMessage(util.format(
                ERROR_PASSWORD, 
                options.password.minLength, 
                options.password.minUppercase, 
                options.password.minLowercase, 
                options.password.minNumbers, 
                options.password.minSymbols)),
            body("email").isEmail().withMessage(ERROR_EMAIL),
        ],
    validationCreatedUser: [
        body("username").isAlphanumeric().withMessage(ERROR_USERNAME),
        body("password").isStrongPassword(options.password).withMessage(util.format(
            ERROR_PASSWORD, 
            options.password.minLength, 
            options.password.minUppercase, 
            options.password.minLowercase, 
            options.password.minNumbers, 
            options.password.minSymbols)),
        body("email").isEmail().withMessage(ERROR_EMAIL),
        body("role").isIn(['User', 'Admin', 'Mod']).withMessage("role khong dung")
    ],
    validationChangePassword: [
        body("newPassword").isStrongPassword(options.password).withMessage(util.format(
            ERROR_PASSWORD, 
            options.password.minLength, 
            options.password.minUppercase, 
            options.password.minLowercase, 
            options.password.minNumbers, 
            options.password.minSymbols)),
    ],
    validationSignIn: [
        body("username").isAlphanumeric().withMessage(ERROR_SIGNIN),
        body("password").isStrongPassword(options.password).withMessage(ERROR_SIGNIN)
    ]
}