const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const authMiddleware = asyncHandler( async(req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

            const user = await User.findById(decoded.id);

            req.user = user;

            next();

        } catch (error) {
            res.status(404);
            throw new Error('user not authorized, invalid token');
        }
    }

})

module.exports = authMiddleware;