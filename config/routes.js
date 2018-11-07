const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/User.js');
const AccessCode = require('../models/AccessCode.js');

const user = require('../managers/user.js');
const post = require('../managers/post.js');
const session = require('../managers/session.js');

const validator = require('../middlewares/validation.js');
const jwt = require('../middlewares/jwt.js');

/* Users */
router.get('/users', jwt.verifyJWT, user.getUser);

/* Posts */
router.get('/posts', jwt.verifyJWT, post.getPostFeed);
router.get('/posts/followed', jwt.verifyJWT, post.getFollowedPosts);
router.post('/posts', validator.validPost, jwt.verifyJWT, post.makePost);

/* Sessions */
router.post('/signup', validator.validUser, user.signup, session.login);
router.post('/login', validator.validUserLogin, session.login);

module.exports = router;
