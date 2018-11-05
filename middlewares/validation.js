const debug = require('debug')('diagram:middleware:validation');
const { check, validationResult } = require('express-validator/check');
const errorTypes = require('../config/errorTypes.js');

const validUserLogin = [
    check('username')
        .exists(),
    check('password')
        .exists(),
];

const validUser = [
    check('username')
        .exists()
        .isLength({ min: 5, max: 32 })
        .isAlphanumeric(),
    check('password')
        .exists()
        .isLength({ min: 8, max: 64 }),
        //.matches(add password requirements?)
    check('accessCode')
        .exists()
        .isLength(8),
];

module.exports = {
    validUserLogin,
    validUser,
};
