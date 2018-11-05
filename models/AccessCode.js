const debug = require('debug')('diagram:model:AccessCode');
const mongoose = require('mongoose');
const errorTypes = require('../config/errorTypes.js');

const accessCodeSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    // TODO: constrain accessCodes to a set format
    accessCode: { type: String, required: true, unique: true },
    userType: { type: String, enum: ['admin', 'patient', 'doctor'], required: true }
});

const model = mongoose.model('AccessCode', accessCodeSchema);

/**
 * checks to see if the string of code exists within db
 * @returns {Promise}
 *      resolves: userType assoicated to the code
 *      rejects: error
 * @param {String} code
 */
function valid(code) {
    debug('exist()');

    return model
        .findOne({ accessCode: code })
        .then((result) => {
            if (result) {
                return result.userType;
            } else {
                throw [ errorTypes.INVALID_ACCESS_CODE ];
            }
        });
}

/**
 * removes an access code from the db
 * @param {String} code to delete
 */
function deleteCode(code) {
    debug('deleteCode()');

    model
        .findOneAndDelete({ accessCode: code })
        .then((result) => {
            if(!result) {
                // Should not happen, this would mean a race condition deleting access code
                throw [ errorTypes.CODE_ALREADY_DELETED ];
            }
        });
}

module.exports = {
    model,
    valid,
    deleteCode,
};
