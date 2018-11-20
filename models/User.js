const debug = require('debug')('diagram:model:User');
const mongoose = require('mongoose');
const errorTypes = require('../config/errorTypes.js');
const hash = require('../utils/hash.js');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true},
    password: { type: String, required: true, select: false },
    userType: { type: String, enum: ['admin', 'patient', 'doctor'], required: true },
    firstName: { type: String },
    lastName: { type: String },
    medications: { type: String },
    recentProcedures: { type: String },
    conditions: { type: String },
    following: [
        { type: mongoose.Schema.Types.ObjectId }
    ],
    createdAt: { type : Date, default: Date.now, select: false },
    updatedAt: { type : Date, default: Date.now, select: false }
});

const model = mongoose.model('User', userSchema);

/**
 * Creates a new user
 * @param {Object} user contans user info
 * @return {Promise} resolves if the user is created successfully
 *                   rejects if user creation fails
 */
const create = (user) => {
    debug('create()');

    return model
        .find({ username: user.username }) /* asyn call db just to check for user name duplication */
        .then((result) => {
            if (result && result.length > 0) {
                throw [ errorTypes.DUPLICATE_USERNAME ];
            } else {
                return new model({
                    _id:              new mongoose.Types.ObjectId(),
                    username:         user.username,
                    password:         hash.sha512(user.password, user.username),
                    firstName:        user.firstName,
                    lastName:         user.lastName,
                    userType:         user.userType,
                    medications:      user.medications,
                    recentProcedures: user.recentProcedures,
                    conditions:       user.conditions,
                });
            }
        })
        .then((userModel) => {
            debug(`create(): creating user with model ${userModel.toString()}`);

            return userModel.save();
        });
}

/**
 * Checks username with hashed password in database
 * @param {Object} user contans user info
 * @return {Object} database user object if username matches password
 */
const authenticate = (user) => {
    debug('authenticate()');

    return model
        .findOne({
            username: user.username,
            password: hash.sha512(user.password, user.username)
        })
        .then((result) => {
            return result;
        });
};

/**
 * Updates a user's followed posts list
 * @param  {ObjectId} userId posting user's ID
 * @param  {ObjectId} postId user's post's ID
 * @return {Object} User after adding new post to followed list
 */
const updateFollowing = (userId, postId) => {
    debug('updateFollowing()');
    return model
        .findOneAndUpdate(
            { _id: userId },
            { $push: { following: postId } },
            { new: true }
        )
        .then((result) => {
            return(result);
        });
};

module.exports = {
    model,
    create,
    authenticate,
    updateFollowing,
};
