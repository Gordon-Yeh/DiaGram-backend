const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    comments: [
    	mongoose.Schema.Types.ObjectId
    ],
    createdAt: { type : Date, default: Date.now },
    updatedAt: { type : Date, default: Date.now, index: true }
});

module.exports = mongoose.model('Post', postSchema);