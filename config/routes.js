const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');
const AccessCode = require('../models/AccessCode.js');

const user = require('../managers/user.js');
const post = require('../managers/post.js');
const session = require('../managers/session.js');

// User routes
router.get('/users/', (req, res) => {
    User
        .model
        .find()
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(error);
        });
});

router.post('/users/add', user.signup);

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

module.exports = router;