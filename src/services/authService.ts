import { User } from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { Response } from 'express';
import { config } from '../config/env';
import { AppError } from '../types/error';

export const registerUser = async (email: string, password: string) => {
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('User already exists', 409);
     
    const user = new User({ email, password });

    await user.save();

    return user;
};

export const generateTokenAndSetCookie = (res: Response, userId: string, email: string) => {
    try {
        const token = jwt.sign({ userId, email }, config.jwt.secret, { expiresIn: '1h' });

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: config.server.env === "production",
            sameSite: "strict",
            maxAge: 60 * 60 * 1000,
        });

        return token;
    } catch (error) {
        throw new AppError('Error generating authentication token', 500);
    }
}

export const authenticateUser = async (email: string, password: string) => {
    const user = await User.findOne({ email });
    if (!user) {
        throw new AppError('Invalid credentials', 401);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw new AppError('Invalid credentials', 401);
    }

    const token = jwt.sign(
        { userId: user._id, email },
        config.jwt.secret,
        { expiresIn: '1h' }
    );

    return { user, token };
};
