const debug = require('debug')('diagram:manager:user');
const User = require('../models/User.js');
const AccessCode = require('../models/AccessCode.js');
const mongoose = require('mongoose');
const errorTypes = require('../config/errorTypes.js');

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
        experience: req.body.experience,
        department: req.body.department,
        specializations: req.body.specializations
    };

    let code = req.body.accessCode;

    AccessCode
        .valid(code)
        .then((userType) => {
            newUser.userType = userType;
            return User.create(newUser);
        })
        .then((userResult) => {
            return AccessCode.deleteCode(code);
        })
        .then(() => {
            next(); //go to login
        })
        .catch((err) => {
            debug(`CAUGHT ERROR ${err.toString()}`);

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
                    debug(`CAUGHT ERROR ${err.toString()}`);

                    res.status(500).json({ errors: err });
                }
                res.status(200).send(result);
            });
    } else if(userType === 'patient') {
        User.model
            .findById(userId, '-firstName -lastName -username -following', (err, result) => {
                if(err) {
                    debug(`CAUGHT ERROR ${err.toString()}`);
                    res.status(500).json({ errors: err });
                }
                res.status(200).send(result);
            });
    } else {
        res.status(400).json({ errors: errorTypes.INVALID_USER_TYPE});
    }
}

function editProfile(req, res) {
    debug('editProfile()');

    User.model
        .findByIdAndUpdate(req.user._id, req.body, {new: true}, (err, result) => {
                                    // TODO: ^ need to error check req.body or else ANYTHING
                                    //   can be updated, including _id, and username
            if(err) {
                debug(`CAUGHT ERROR ${err.toString()}`);
                res.status(500).json({ errors: err });
            }
            res.status(200).send(result);
        });
}

module.exports = {
    signup,
    viewProfile,
    editProfile,
};
