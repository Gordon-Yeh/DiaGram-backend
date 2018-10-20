const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');
const session = require('../managers/session.js');
const AccessCode = require('../models/AccessCode.js');

router.get('/', (req, res) => {
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
router.post('/add', (req, res) => {
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

module.exports = router;