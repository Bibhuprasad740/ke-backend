const express = require('express');
const User = require('../models/user');
const bcryptjs = require('bcryptjs');
const authRouter = express.Router();
const jwt = require('jsonwebtoken');
const auth = require('../middlewares/auth_middleware');

const publicKey = "passwordKey";

//  sign up route -->
authRouter.post("/api/signup/", async (request, response) => {
    try {
        const { name, email, password } = request.body;

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return response.status(400).json({
                message: 'User with same email already exists!'
            });
        }
        const salt = 10;
        const hashedPassword = await bcryptjs.hash(password, salt);

        let user = User({
            email,
            password: hashedPassword,
            name,
        });

        user = await user.save();
        response.json(user);
    } catch (e) {
        response.status(500).json({
            error: e.message,
        });
    }
});

// sign in route -->
authRouter.post("/api/signin/", async (request, response) => {
    try {
        const { email, password } = request.body;

        const user = await User.findOne({ email });
        if (!user) {
            return response.status(400).json({
                message: 'User with this email does not exist!',
            });
        }
        const correctPassword = await bcryptjs.compare(password, user.password);
        if (!correctPassword) {
            return response.status(400).json({
                message: 'Incorrect password!',
            });
        }
        const token = jwt.sign({ id: user._id }, publicKey);
        response.json({ token, ...user._doc });
    } catch (exception) {
        response.status(500).json({
            error: exception.message,
        });
    }
});

// is token valid -->
authRouter.post("/tokenIsValid", async (request, response) => {
    const authToken = 'x-auth-token';
    try {
        const token = request.header(authToken);
        if (!token) return response.json(false);
        const isValidToken = jwt.verify(token, publicKey);
        if (!isValidToken) return response.json(false);
        const user = await User.findById(isValidToken.id);
        if (!user) return response.json(false);
        return response.json(true);

    } catch (exception) {
        response.status(500).json({
            error: exception.message,
        });
    }
});

//get user data
authRouter.get("/", auth, async (request, response) => {
    const user = User.findById(request.user);
    response.json({ ...user._doc, token: request.token });
})


module.exports = authRouter;