const debug = require('debug')('diagram:manager:session');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); //TODO: move to model code
const { check, validationResult } = require('express-validator/check');

// TODO: share secret key so middleware can use
// TODO: make these env variables
const SECRET_KEY = 'We have no idea what doctors or patients actually want';

/**
 * Verifies user information with database
 */
function login(req, res) {
    debug('login()');

    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(422).json({ errors: error.array() });
    }

    let user = {
        username: req.body.username,
        password: req.body.password
    };

    User.authenticate(user)
    .then((result) => {
        if(result) {
            jwt.sign({user}, SECRET_KEY, /*{ expiresIn: SESSION_TIMEOUT },*/
            (err, token) => {
                res.json({
                    jwt: token,
                    user: result
                });
            });
        } else {
            res.status(401).send('Invalid user credentials');
        }
    })
    .catch((err) => {
        res.status(500).send(err);
    });
}

module.exports = {
    login,
}
