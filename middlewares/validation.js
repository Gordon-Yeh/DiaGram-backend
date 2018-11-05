const debug = require('debug')('diagram:middleware:validation');
const { check, validationResult } = require('express-validator/check');
const errorTypes = require('../config/errorTypes.js');

const userLogin = [
    check('username')
        .exists(),
    check('password')
        .exists(),
];

const userSignup = [
    check('username')
        .isLength({ min: 5, max: 32})
        .isAlphanumeric(),
    check('password')
        .isLength({min: 8, max: 32}),
        //.matches(add pw requirements?)
];

/*
function userSignup(req, res, next) {
    debug('signup()');

    let err = [];

    let username = req.body.username;
    let password = req.body.password;

    // TODO: set better requirements
    if (typeof username !== 'string' || username.length < 10) {
        debug('invalid username');

        err.push(errorTypes.INVALID_USERNAME);
    }

    if (typeof password !== 'string' || password.length < 5) {
        debug('invalid password');

        err.push(errorTypes.INVALID_PASSWORD);
    }

    if (err.length > 0) {
        res.status(400).json({ errors: err });
    } else {
        next();
    }
}
*/

module.exports = {
    userLogin,
    userSignup,
};
