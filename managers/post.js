const debug = require('debug')('diagram:manager:Post');
const Post = require('../models/Post.js');
const errorTypes = require('../config/errorTypes');

function makePost(req, res) {
    debug('makePost()');

    Post
        .create({
            title: req.body.title,
            body: req.body.body,
            userId: req.user._id,
            userType: req.user.userType
        })
        .then((postModel) => {
            return postModel.save();
        })
        .then((postObject) => {
            debug(`makePost() CREATED new post ${JSON.stringify(postObject)}`);
            // TODO: modify the return post object to match documentation
            res.json(postObject);
        })
        .catch((err) => {
            debug(`makePost() CAUGHT ERROR ${err.toString()}`);
            res.status(500).json({ errors: [errorTypes.INTERNAL_SERVER_ERROR] });
        });
}

// TODO: add filter query
function getPosts(req, res) {
    debug('getPosts()');

    Post
        .model
        .find()
        .then((posts) => {
            res.json(posts);
        })
        .catch((err) => {
            debug(`makePost() CAUGHT ERROR ${err.toString()}`);
            res.status(500).json({ errors: [errorTypes.INTERNAL_SERVER_ERROR] });
        });
}

module.exports = {
    getPosts,
    makePost
};
