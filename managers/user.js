const User = require('../models/User.js');
const AccessCode = require('../models/AccessCode.js');

function signup(req, res) {
    let newUser = {
        _id: new mongoose.Types.ObjectId(),
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
    };

    let code = req.body.code;

    // TODO: change respond with correct status code for different errors
    AccessCode
        .exist(code)
        .then((userType) => {
            newUser.userType = userType;
            return User.create(newUser);
        })
        .then((userModel) => {
            return userModel.save();
        })
        .then((userResult) => {
            return AccessCode.findOneAndDelete({ accessCode: code });
        })
        .then(() => {
            res.json({
                username: newUser.username,
                userType: newUser.userType
            });
        })
        .catch((err) => {
            res.status(500).json(err);
        });
}

function getUser(req, res) {
    res.status(200).send("this is just to make sure JWT works!");
}

module.exports = {
    signup,
    getUser,
};
