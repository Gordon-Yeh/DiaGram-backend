const express = require('express');
const debug = require('debug')('diagram:config:testRoutes');
const router = express.Router();
const mongoose = require('mongoose');

const User = require('../models/User.js');
const AccessCode = require('../models/AccessCode.js');

router.post('/codes', (req, res) => {
    let accessCode = {
        accessCode: req.query.accessCode,
        userType: req.query.userType,
    };
    debug(`add access code: ${accessCode.toString()}`);

    AccessCode.create(accessCode)
        .then((result) => {
            res.status(200).send(result);
        })
        .catch((err) => {
            res.status(400).send('No user created!');
        });
});

router.delete('/users', (req, res) => {
    let user = req.query.username;
    debug(`delete user: ${user.toString()}`);

    User.model
        .findOneAndDelete({ username: user })
        .then((result) => {
            if(result) {
                res.json({
                    message: 'success',
                    userDeleted: result,
                });
            }
            else {
                res.status(400).send('No user deleted!');
            }
        })
        .catch((err) => {
            res.status(400).send(err);
        });
});

module.exports = router;
