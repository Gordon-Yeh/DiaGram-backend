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
        medications: req.body.medications,
        recentProcedures: req.body.recentProcedures,
        conditions: req.body.conditions,
    };

    let code = req.body.accessCode;

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

function viewProfile(req, res) {
    debug('viewProfile()');
    let userId = req.params.user_id;
    let userType = req.user.userType;

    if(userType === 'doctor') {
        User.model
            .findById(userId, '-following', (err, result) => {
                if(err) {
                    debug(err);
                    res.status(500).json({ errors: err });
                }
                res.status(200).send(result);
            });
    } else if(userType === 'patient') {
        User.model
            .findById(userId, '-firstName -lastName -username -following', (err, result) => {
                if(err) {
                    debug(err);
                    res.status(500).json({ errors: err });
                }
                res.status(200).send(result);
            });
    } else {
        res.status(400).json({ errors: errorTypes.INVALID_USER_TYPE});
    }
}

function viewOwnProfile(req, res) {
    debug('viewOwnProfile()');

    User.model
        .findById(req.user._id, (err, result) => {
            if(err) {
                debug(err);
                res.status(500).json({ errors: err });
            }
            res.status(200).send(result);
        });
}

function editProfile(req, res) {
    debug('editProfile()');

    User.model
        .findByIdAndUpdate(req.user._id, req.body, {new: true}, (err, result) => {
            if(err) {
                debug(err);
                res.status(500).json({ errors: err });
            }
            res.status(200).send(result);
        });
}

module.exports = {
    signup,
    viewOwnProfile,
    viewProfile,
    editProfile,
};
