require('dotenv').config();
const jwt = require('jsonwebtoken');
const {TOKEN_SECRET} = process.env; // 30 days by seconds


// reference: https://thecodebarbarian.com/80-20-guide-to-express-error-handling
const wrapAsync = (fn) => {
    return function(req, res, next) {
        // Make sure to `.catch()` any errors and pass them along to the `next()`
        // middleware in the chain, in this case the error handler.
        fn(req, res, next).catch(next);
    };
};

const authenticate = (role) => {
    return function (req, res, next) {
        let accessToken = req.get('Authorization')
        if (!accessToken) return res.status(401).json({error: 'Unauthorized'})

        accessToken = accessToken.replace('Bearer ', '');
        if (accessToken == 'null') return res.status(401).json({error: 'Unauthorized'})

        try {
            const user = jwt.verify(accessToken, TOKEN_SECRET);
            req.user = user;

            if (role === 'member') next()
            else if (role === 'coach' && user.role > 1) next()
            else if (role === 'gym' && user.role > 2 ) next()
            else throw new Error
               
        } catch(err) {
            return res.status(403).send({error: 'Forbidden'})
        }
    };
};

module.exports = {
    wrapAsync,
    authenticate
};
