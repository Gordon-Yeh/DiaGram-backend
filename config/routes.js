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
router.get('/users', jwt.verifyJWT, user.viewOwnProfile);
router.get('/users/:user_id', jwt.verifyJWT, user.viewProfile);
router.put('/users', jwt.verifyJWT, user.editProfile);

/* Posts */
router.get('/posts', jwt.verifyJWT, post.getPostFeed);
router.get('/posts/followed', jwt.verifyJWT, post.getFollowedPosts);
router.post('/posts', jwt.verifyJWT, post.makePost);
router.post('/posts/:post_id/comments', jwt.verifyJWT, validator.validComment, post.makeComment);

/* Sessions */
router.post('/signup', validator.validUser, user.signup, session.login);
router.post('/login', validator.validUserLogin, session.login);

module.exports = router;
