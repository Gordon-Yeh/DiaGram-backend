const debug = require('debug')('diagram:manager:user');
const User = require('../models/User.js');
const AccessCode = require('../models/AccessCode.js');
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator/check');

function signup(req, res, next) {
    debug('signup()');

    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    let newUser = {
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    let code = req.body.accessCode;

    // TODO: change respond with correct status code for different errors
    AccessCode
        .valid(code)
        .then((userType) => {
            newUser.userType = userType;
            return User.create(newUser);
        })
        .then((userResult) => {
            debug('delete code');

            return AccessCode.deleteCode(code);
        })
        .then(() => {
            next(); //go to login
        })
        .catch((err) => {
            debug(err);

            res.status(400).json({ errors: err });
        });
}

function getUser(req, res) {
    let errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ errors: errors.array() });
    }

    let username = req.query.username;

    User.model
        .findOne({ username: username })
        .then((result) => {
            res.send(result);
        })
        .catch((err) => {
            debug(err);

            res.status(500).json({ errors: err });
        });
}

module.exports = {
    signup,
    getUser,
};
