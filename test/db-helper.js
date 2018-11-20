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

const createPost = (user, post) => {
    return Post
        .create({
            ...post,
            userType: user.userType,
            userId: user._id
        })
        .then((model) => {
            return model
                .save()
                // need model info later so pass it on
                .then(() => { return model });
        });
}

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
    createPost,
    deletePost,
    checkPostExist,
    // user
    createUser,
    deleteUser,
    checkUser,
    // access code
    addAccessCode
};