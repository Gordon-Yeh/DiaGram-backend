const debug = require('debug')('diagram:manager:user');
const User = require('../models/User.js');
const AccessCode = require('../models/AccessCode.js');
const mongoose = require('mongoose');

function signup(req, res, next) {
    debug('signup()');

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
        .exist(code)
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

            res.status(500).json({ errors: err });
        });
}

function getUser(req, res) {
    res.status(200).send("this is just to make sure JWT works!");
}

module.exports = {
    signup,
    getUser,
};
