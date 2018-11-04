const debug = require('debug')('diagram:middleware:validation');
const { check, validationResult } = require('express-validator/check');
const errorTypes = require('../config/errorTypes.js');

let userLogin = [
    check('username').exists().isString(),
    check('password').exists().isString(),
];

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

module.exports = {
    userLogin,
    userSignup,
};
