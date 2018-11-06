const debug = require('debug')('diagram:manager:session');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js'); //TODO: move to model code
const env = require('../config/env.js').get();

/**
 * Verifies user information with database
 */
function login(req, res) {
    debug('login()');

    let user = {
        username: req.body.username,
        password: req.body.password
    };

    User.authenticate(user)
    .then((result) => {
        if(result) {
            jwt.sign(
                { user: {
                    _id:      result._id,
                    username: result.username,
                    userType: result.userType
                } },
                /*{ expiresIn: SESSION_TIMEOUT },*/
                env.JWT_SECRET,
                (err, token) => {
                    res.json({
                        jwt: token,
                        user: result
                    });
                }
            );
        } else {
            res.status(401).send({ errors: [errorTypes.UNAUTHORIZED] });
        }
    })
    .catch((err) => {
        debug(`error: ${err}`);
        res.status(500).send(err);
    });
}

module.exports = {
    login,
};
