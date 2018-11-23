const debug = require('debug')('diagram:manager:Post');
const Post = require('../models/Post.js');
const User = require('../models/User.js');
const errorTypes = require('../config/errorTypes');

function makePost(req, res, next) {
    debug('makePost()');

    Post
        .create({
            title: req.body.title,
            body: req.body.body,
            private: req.body.private,
            userId: req.user._id,
            userType: req.user.userType
        })
        .then((postModel) => {
            debug(`makePost() CREATED new post ${JSON.stringify(postModel)}`);

            return postModel
                .save()
                .then((postObject) => {
                    User.updateFollowing(req.user._id, postObject._id);
                    return Post.fetchOne({ _id: postObject._id });
                })
                .then((pt) => {
                    res.status(200).json(pt);
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

/**
 * Gets and sends back queried post(s), full feed by default
 * @param  {Object} req the request
 * @param  {Object} res the response
 */
function getPostFeed(req, res) {
    debug('getPostFeed()');

    let query = { };

    if(req.query.post_id) {
       query = { _id: req.query.post_id };
    }

    if(req.user.userType === 'patient') {
        query.private = false;
    }

    debug(query);

    Post
        .fetch(query)
        .then((posts) => {
            res.json(posts);
        })
        .catch((err) => {
            debug(`getPostFeed() CAUGHT ERROR ${err.toString()}`);

            res.status(500).json({ errors: [errorTypes.INTERNAL_SERVER_ERROR] });
        });
}

/**
 * Gets and sends back all posts a certain user is following
 * @param  {Object} req the request
 * @param  {Object} res the response
 */
function getFollowedPosts(req, res) {
    debug('getFollowedPosts()');

    let query = { _id: { $in: req.user.following } };

    Post
        .fetch(query)
            .then((posts) => {
                res.json(posts);
            })
            .catch((err) => {
                debug(`getFollowedPosts() CAUGHT ERROR ${err.toString()}`);

                res.status(500).json({ errors: [errorTypes.INTERNAL_SERVER_ERROR] });
            });
}

/**
 * Adds a comment to the post specified in the parameters of the request, with
 * the text in the body of the request
 * @param  {Object} req the request
 * @param  {Object} res the response
 */
function makeComment(req, res) {
    debug('makeComment()');

    let comment = {
        body: req.body.body,
        userId: req.user._id,
        userType: req.user.userType,
        postId: req.params.post_id,
    };

    Post
        .addComment(comment)
        .then((post) => {
            if(comment.userType === 'doctor') {
                return User
                    .updateFollowing(comment.userId, comment.postId)
                    .then(() => {
                        res.json(post);
                    });
            }
            res.json(post);
        })
        .catch((err) => {
            debug(`makeComment() CAUGHT ERROR ${err.toString()}`);

            res.status(500).json({ errors: [errorTypes.INTERNAL_SERVER_ERROR] });
        });
}

module.exports = {
    getPostFeed,
    getFollowedPosts,
    makePost,
    makeComment,
};
