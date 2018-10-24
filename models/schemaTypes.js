const mongoose = require('mongoose');

module.exports = {
    id: mongoose.Schema.Types.ObjectId,
    userType: { type: String, enum: ['admin', 'patient', 'doctor'], required: true },
    date: { type : Date, default: Date.now },
};