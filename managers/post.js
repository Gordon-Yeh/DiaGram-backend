const debug = require('debug')('diagram:manager:Post');
const Post = require('../models/Post.js');
const errorTypes = require('../config/errorTypes');

function makePost(req, res, next) {
    debug('makePost()');

    Post
        .create({
            title: req.body.title,
            body: req.body.body,
            userId: req.user._id,
            userType: req.user.userType
        })
        .then((postModel) => {
            debug(`makePost() CREATED new post ${JSON.stringify(postModel)}`);

            return postModel
                .save()
                .then((postObject) => {
                    return Post.fetchOne({ _id: postObject._id });
                })
                .then((pt) => {
                    res.json(pt);
                })
                .catch((err) => {
                    debug(`makePost() CAUGHT ERROR ${err.toString()}`);

                    res.status(500).json({ errors: [errorTypes.INTERNAL_SERVER_ERROR] });
                });
        })
        .catch((err) => {
            debug(`makePost() CAUGHT ERROR ${err.toString()}`);

            res.status(400).json({ errors: err });
        });
}

// TODO: add filter query
function getPosts(req, res) {
    debug('getPosts()');

    Post
        .fetch()
        .then((pts) => {
            res.json(pts);
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
