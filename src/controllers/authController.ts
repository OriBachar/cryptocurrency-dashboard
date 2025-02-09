import { RequestHandler } from 'express';
import { registerUser, authenticateUser, generateTokenAndSetCookie } from '../services/authService'

export const register: RequestHandler = async (req, res, next) => {
    try {
        await registerUser(req.body.email, req.body.password);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        next(error);
    }
};

export const login: RequestHandler = async (req, res, next) => {
    try {
        const { user, token } = await authenticateUser(req.body.email, req.body.password);
        generateTokenAndSetCookie(res, user._id, user.email);
        res.status(200).json({ message: 'Logged in successfully' });
    } catch (error) {
        next(error);
    }
};