const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const AccessCode = require('../models/AccessCode.js');

//temporary, can be used to add access codes through the API for now
router.post('/', (req, res) => {
    let newAccessCode = new AccessCode({
        _id: new mongoose.Types.ObjectId(),
        accessCode: req.body.accessCode,
        userType: req.body.userType
    });

    newAccessCode
        .save()
        .then((result) => {
            res.status(201).send(result);
        })
        .catch((err) => {
            console.error(err);
            res.status(500).send(err);
        });
});

module.exports = router;