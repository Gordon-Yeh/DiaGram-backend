const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); //TODO: move to model code
const {check, validationResult } = require('express-validator/check');

//TODO: share secret key so middleware can use
const SECRET_KEY = 'We have no idea what doctors or patients actually want';
const SESSION_TIMEOUT = '1h';

/**
 * Verifies user information with database
 *
 */
function login(req, res) {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({ errors: error.array() });
    }

    let user = {
        username: req.body.username,
        password: req.body.password
    };

    authenticate(user)
        .then((auth) => {
            jwt.sign({user}, SECRET_KEY, { expiresIn: SESSION_TIMEOUT },
            (err, token) => {
                res.json({
                    token
                });
                console.log(token);
            });
        })
        .catch((err) => {
            console.log('error: ' + err);
            res.status(500).send(err);
        });
}

/**
 * @returns {Promise}
 *     resolves: user credentials are valid
 *     rejects: user credentials invalid
 * @param {user} username and password required to authenticate user
 * TODO: dummy function, check database to verify username and password
 * TODO: add security, so there's no plaintext password
 */
function authenticate(user) {
    return new Promise((resolve, reject) => {
        if(user) {
            resolve();
        } else {
            reject();
        }
    });
}

module.exports = {
    login,
}
