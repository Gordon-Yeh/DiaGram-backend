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

router.post('/users/add', user.signup/*, session.login*/);
router.get('/users', jwt.verifyToken, jwt.verifyJWT, user.getUser);

router.post('/login', validator.userSignup, session.login);

module.exports = router;
