const debug = require('debug')('diagram:model:Post');
const mongoose = require('mongoose');
const types = require('./schemaTypes.js');
const errorTypes = require('../config/errorTypes');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    title: { type: String, required: true },
    body: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    userType: types.userType,
    comments: [],
    createdAt: { type : Date, default: Date.now },
    updatedAt: { type : Date, default: Date.now, index: true },
    __v: { type: Number, select: false }
});

const model = mongoose.model('Post', postSchema);

/**
 * Create a model that includes the fields
 * @returns {Promise} resolves a Post model
 * @param {Object} fields requires: { title, body, userId, userType }
 */
const create = (fields) => {
    debug(`create(): fields = ${JSON.stringify(fields)}`);

    return new Promise((resolve, reject) => {
        errors = [];

        if (!fields.title) {
            errors.push(errorTypes.EMPTY_TITLE);
        }

        if (!fields.body) {
            errors.push(errorTypes.EMPTY_BODY);
        }

        if (errors.length > 0) {
            reject(errors);
        }

        resolve(new model({
            _id: new mongoose.Types.ObjectId(),
            title: fields.title,
            body: fields.body,
            userId: fields.userId,
            userType: fields.userType,
        }));
    })
}

module.exports = {
    model,
    create,
};