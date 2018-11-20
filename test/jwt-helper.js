const jwt = require('jsonwebtoken');
const env = require('../config/env.js').get();

const getJwt = (user) => {
    let payload = {
        user: {
            _id:      user._id,
            username: user.username,
            userType: user.userType
        } 
    };

    return jwt.sign(
        payload,
        /*{ expiresIn: SESSION_TIMEOUT },*/
        env.JWT_SECRET
    );
};

module.exports = {
    getJwt
};