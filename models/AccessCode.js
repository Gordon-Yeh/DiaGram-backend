const mongoose = require('mongoose');

const accessCodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    accessCode: { type: String, required: true, unique: true },
    userType: { type: String, required: true} //{ enum: ['admin', 'patient', 'doctor'] }
});

module.exports = mongoose.model('AccessCode', accessCodeSchema);