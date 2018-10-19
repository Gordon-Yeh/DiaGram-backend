const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    userType: { type: String,/*{ enum: ['admin', 'patient', 'doctor'] },*/ required: true },
    firstName: { type: String },
    lastName: { type: String },
    following: [mongoose.Schema.Types.ObjectId],
    createdAt: { type : Date, default: Date.now },
    updatedAt: { type : Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
