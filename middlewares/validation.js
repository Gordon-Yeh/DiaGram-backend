const debug = require('debug')('diagram:middleware:validation');
const errorTypes = require('../config/errorTypes.js');
const Post = require('../models/Post.js');

function validUserLogin(req, res, next) {
    debug('validUserLogin');

    let errors = [];

    if(typeof req.body.username !== 'string') {
        errors.push(errorTypes.INVALID_USERNAME);
    }

    if (typeof req.body.password !== 'string') {
        errors.push(errorTypes.INVALID_PASSWORD);
    }

    if (errors.length > 0) {
        debug(`CAUGHT ERROR ${errors.toString()}`);

        res.status(400).json({ errors: err });
    } else {
        next();
    }
}

function validUser(req, res, next) {
        debug('validUser()');

        let errors = [];

        let username = req.body.username;
        let password = req.body.password;

        // TODO: set better requirements
        if (typeof username !== 'string' || username.length < 5 || username.length > 32) {
            errors.push(errorTypes.INVALID_USERNAME);
        }

        if (typeof password !== 'string' || password.length < 8 || password.length > 64) {
            errors.push(errorTypes.INVALID_PASSWORD);
        }

        if (errors.length > 0) {
            debug(`CAUGHT ERROR ${errors.toString()}`);
            
            res.status(400).json({ errors: errors });
        } else {
            next();
        }
}

function validComment(req, res, next) {
    debug('validComment()');

    let errors = [];

    Post.model.findById(req.params.post_id, (error, result) => {
        if(error) {
            errors.push(errorTypes.INTERNAL_SERVER_ERROR);
            res.status(500).json({ errors: errors });
        }

        if(!result) {
            errors.push(errorTypes.POST_NOT_FOUND);
            res.status(400).json({ errors: errors });
        }

        //if user is not post owner, refuse comment
        if(req.user.userType === 'patient' && result.userId.toString() !== req.user._id.toString()) {
            errors.push(errorTypes.WRONG_USER);
            res.status(403).json({ errors: errors });
        }

        if (errors.length > 0) {
            debug(`CAUGHT ERROR ${errors.toString()}`);
        } else {
            next();
        }
    });
}

module.exports = {
    validUserLogin,
    validUser,
    validComment,
};
