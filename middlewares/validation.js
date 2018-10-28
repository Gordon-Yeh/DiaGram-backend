const { check, validationResult } = require('express-validator/check');

let userLogin = [
    check('username').exists().isString(),
    check('password').exists().isString(),
];

module.exports = {
    userLogin,
};
