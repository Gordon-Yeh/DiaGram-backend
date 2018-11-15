const debug = require('debug')('diagram:middleware:jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const errorTypes = require('../config/errorTypes');
const env = require('../config/env.js').get();

function verifyJWT(req, res, next) {
    debug('verifyJWT()');
    var bearer, bearerToken;

    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        bearer = bearerHeader.split(' ');
        bearerToken = bearer[1];
    } else {
        res.status(401).send({ errors: [errorTypes.UNAUTHORIZED] });
    }

    jwt.verify(bearerToken, env.JWT_SECRET, (err, payload) => {
        if (err) {
            debug(`verifyJWT(): error ${JSON.stringify(err)}`);
            res.status(401).send({ errors: [errorTypes.UNAUTHORIZED] });
        } else {
            debug(`verifyJWT() payload: ${JSON.stringify(payload)}`);
            User
                .model
                .findOne(payload.user)
                .then((user) => {
                    if (!user) {
                        res.status(401).send({ errors: [errorTypes.UNAUTHORIZED] });
                    } else {
                        req.user = user;
                        next();
                    }
                })
                .catch((err) => {
                    res.status(500).send({ errors: [errorTypes.INTERNAL_SERVER_ERROR] });
                });
        }
    });
}

module.exports = {
    verifyJWT,
};
