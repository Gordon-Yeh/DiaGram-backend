const { check, validationResult } = require('express-validator/check');

let userSignup = [
    check('username').exists().isString(),
    check('password').exists().isString(),
];

module.exports = {
    userSignup,
}
