const { check, validationResult } = require('express-validator/check');

let userSignup = [
    check(),
    check(),
]

module.exports = {
    userSignup,
}