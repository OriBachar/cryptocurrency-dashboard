import { RequestHandler } from 'express';
import { User } from '../models/User';
import { config } from '../config/env';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const register: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        
        const token = jwt.sign({ email }, config.jwt.secret, { expiresIn: '1h' });

        const user = new User({
            email,
            password: hashedPassword,
            token
        });

        await user.save();
        res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        next(error);
    }
};

export const login: RequestHandler = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ email }, config.jwt.secret, { expiresIn: '1h' });
        res.status(200).json({ token });
    } catch (error) {
        next(error);
    }
};