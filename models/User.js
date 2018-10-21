const mongoose = require('mongoose');
const errors = require('../config/errorTypes.js');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String, enum: ['admin', 'patient', 'doctor'], required: true },
    firstName: { type: String },
    lastName: { type: String },
    following: [mongoose.Schema.Types.ObjectId],
    createdAt: { type : Date, default: Date.now },
    updatedAt: { type : Date, default: Date.now }
});

const model = mongoose.model('User', userSchema);

/**
 * 
 * @return {Promise} resolve: User model 
 * 
 * @param {Object} user object containing the fields to create a User model 
 */
const create = (user) => {
    let userModel = new model(user);

    var validate = userModel.validateSync();
    var errors = [];

    return model
        .find({ username: user.username }) /* asyn call db just to check for user name duplication */
        .then((result) => {
            if (result && result.length > 0) {
                errors.push(errors.DUPLICATE_USERNAME);
            }

            if (validate.errors['password'].message) {
                errors.push(errors.INVALID_PASSWORD);
            }
            
            if (validate.errors['userType'].message) {
                errors.push(errors.INVALID_USER_TYPE);
            }

            if (errors.length > 0) {
                throw { error: errors };
            }

            return userModel;
        });
}

module.exports = {
    model,
    create,
}
