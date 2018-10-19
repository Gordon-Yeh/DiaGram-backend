const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, index: { unique: true } },
    password: { type: String, required: true },
    firstName: { type: String },
    lastName: { type: String },
    following: [mongoose.Schema.Types.ObjectId],
    createdAt: { type : Date, default: Date.now },
    updatedAt: { type : Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
