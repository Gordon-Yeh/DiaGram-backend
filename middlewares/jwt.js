const debug = require('debug')('diagram:middleware:jwt');
const jwt = require('jsonwebtoken');
const User = require('../models/User.js');
const errorTypes = require('../config/errorTypes');
const env = require('../config/env.js').get();

//TODO: combine these two?
function verifyToken(req, res, next) {
    debug(`verifyToken()}`);

    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.status(403).send({ errors: [errorTypes.UNAUTHORIZED] });
    }
}

function verifyJWT(req, res, next) {
    jwt.verify(req.token, env.JWT_SECRET, (err, payload) => {
        if (err) {
            debug(`verifyJWT(): error ${JSON.stringify(err)}`);
            res.status(403).send({ errors: [errorTypes.UNAUTHORIZED] });
        } else {
            debug(`verifyJWT() payload: ${JSON.stringify(payload)}`);
            User
                .model
                .findOne(payload.user)
                .then((user) => {
                    if (!user) {
                        res.status(403).send({ errors: [errorTypes.UNAUTHORIZED] });
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
    verifyToken,
    verifyJWT,
};
