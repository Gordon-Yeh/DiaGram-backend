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
        .find()
        .then((results) => {
            res.send(results);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(error);
        });
});

//TODO: Fix: currently always deletes access codes right now, even if bad input for user parameters
router.post('/users/add', (req, res) => {
    AccessCode
        .findOneAndDelete({ accessCode: req.body.accessCode })
        .then((accode) => {
            let newUser = new User({
                _id: new mongoose.Types.ObjectId(),
                username: req.body.username,
                password: req.body.password,
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                userType: accode.userType,
            });
    
            newUser
                .save()
                .then((result) => {
                    //AccessCode.findOneAndRemove({ accessCode: req.body.accessCode });
                    console.log('Deleting access code... '+ req.body.accessCode);
                    res.status(201).send(result);
                })
                .catch((err) => {
                    console.error(err);
                    res.status(500).send(err);
                });
        })
        .catch((err) => {
            res.status(500).json({ error: "INVALID_CODE" });
        });
});

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