const jwt = require('jsonwebtoken');

const publicKey = 'passwordKey';

const auth = async (request, response, next) => {
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
    } catch (exception) {
        response.status(500).json({
            error: exception.message,
        });
    }
}