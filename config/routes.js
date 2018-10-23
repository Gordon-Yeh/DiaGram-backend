const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const { check, validationResult } = require('express-validator/check');
const User = require('../models/User.js');
const AccessCode = require('../models/AccessCode.js');

const user = require('../managers/user.js');
const post = require('../managers/post.js');
const session = require('../managers/session.js');

const validator = require('../middlewares/validation.js');
const jwt = require('../middlewares/jwt.js');

router.post('/users/add', user.signup);
router.get('/users', jwt.verifyToken, jwt.verifyJWT, user.getUser);

//temporary, can be used to add access codes through the API for now
router.post('/codes', (req, res) => {
    let newAccessCode = new AccessCode({
        _id: new mongoose.Types.ObjectId(),
        accessCode: req.body.accessCode,
        userType: req.body.userType
    });

    newAccessCode
        .save()
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

router.post('/login', validator.userSignup, session.login);

module.exports = router;
