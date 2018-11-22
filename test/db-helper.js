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
        .then((postModel) => {
            return postModel
                .save()
                .then((post) => {
                    return post;
                });
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

const updateUser = (user, update) => {
    return User.model.updateOne({ _id: user._id }, update);
}

const createAccessCode = (codeBody) => {
    return AccessCode.create(codeBody);
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
    updateUser,
    // access code
    createAccessCode
};
