const jst = require('jsonwebtoken');
const User = require('../models/user');
const publicKey = 'passwordKey';

const admin = async (request, response, next) => {
    const authToken = 'x-auth-token';
    try {
        const token = request.header(authToken);
        if (!token) {
            return response.status(401).json({
                message: 'No auth token! Access Denied!'
            });
        }
        const isValidToken = jwt.verify(token, publicKey);
        if (!isValidToken) return response.status(401).json({
            message: 'Token verification failed! Access Denied!'
        });
        const user = await User.findById(isValidToken.id);
        if (user.type == 'user' || user.type == 'seller') {
            return response.status(401).json({
                message: 'You are not an Admin!'
            });
        }
        request.user = isValidToken.id;
        request.token = token;
        next();
    } catch (exception) {
        response.status(500).json({
            error: exception.message,
        });
    }
}

module.exports = admin;