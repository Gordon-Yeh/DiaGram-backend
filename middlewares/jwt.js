const jwt = require('jsonwebtoken');
//TODO: this is duplicated right now, share this
const SECRET_KEY = 'We have no idea what doctors or patients actually want';

//TODO: combine these two?
function verifyToken(req, res, next) {
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {
        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        req.token = bearerToken;
        next();
    } else {
        res.sendStatus(403);
    }
}

function verifyJWT(req, res, next) {
    jwt.verify(req.token, SECRET_KEY, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'jwt verified',
                authData
            });
        }
    });
}

module.exports = {
    verifyToken,
    verifyJWT,
}
