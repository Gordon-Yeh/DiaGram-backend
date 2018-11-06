const debug = require('debug')('diagram:middleware:validation');
const errorTypes = require('../config/errorTypes.js');

function validUserLogin(req, res, next) {
    debug('validUserLogin');

    let err = [];

    if(typeof req.body.username !== 'string') {
        debug('invalid username');

        err.push(errorTypes.INVALID_USERNAME);
    }

    if (typeof req.body.password !== 'string') {
        debug('invalid password');

        err.push(errorTypes.INVALID_PASSWORD);
    }

    if (err.length > 0) {
        res.status(400).json({ errors: err });
    } else {
        next();
    }
}

function validUser(req, res, next) {
        debug('validUser()');

        let err = [];

        let username = req.body.username;
        let password = req.body.password;

        // TODO: set better requirements
        if (typeof username !== 'string' || username.length < 5 || username.length > 32) {
            debug('invalid username');

            err.push(errorTypes.INVALID_USERNAME);
        }

        if (typeof password !== 'string' || password.length < 8 || password.length > 64) {
            debug('invalid password');

            err.push(errorTypes.INVALID_PASSWORD);
        }

        if (err.length > 0) {
            res.status(400).json({ errors: err });
        } else {
            next();
        }
}

function validPost(req, res, next) {
    debug('validPost()');

    let err = [];

    let title = req.body.title;
    let body = req.body.body;

    //TODO: add post validation?
    next();
}

module.exports = {
    validUserLogin,
    validUser,
    validPost,
};
