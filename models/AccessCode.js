const mongoose = require('mongoose');

const accessCodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accessCode: { type: String, unique: true },
    userType: String//{ enum: ['admin', 'patient', 'doctor'] }
});

module.exports = mongoose.model('AccessCode', accessCodeSchema);