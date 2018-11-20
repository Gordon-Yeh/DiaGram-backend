const User = require('../models/User.js');
const Post = require('../models/Post.js');
const AccessCode = require('../models/AccessCode.js');

const clearDB = () => {
    return Promise.all([
        User.model.deleteMany({}),
        Post.model.deleteMany({}),
        AccessCode.model.deleteMany({})
    ]);
};

const deletePost = (post) => {
    return Post.model.deleteMany(post);
};

const checkPostExist = (post) => {
    return Post.model.findOne(post);
};

const deleteUser = (user) => {
    return User.model.deleteMany({ username: user.username });
};

const checkUser = (user) => {
    return User.model.findOne({ username: user.username });
};

const createUser = (user) => {
    return User.create(user);
}

const addAccessCode = (code, userType) => {
    return AccessCode.create({
        code,
        userType
    });
}

module.exports = {
    clearDB,
    //posts
    deletePost,
    checkPostExist,
    // user
    createUser,
    deleteUser,
    checkUser,
    // access code
    addAccessCode
};