import { RequestHandler } from 'express';
import { registerSchema, loginSchema } from '../types/auth';
import { handleValidationError } from '../utils/validationUtils';

export const validateRegister: RequestHandler = async (req, res, next) => {
    try {
        await registerSchema.parseAsync({
            body: req.body,
        });
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
};

export const validateLogin: RequestHandler = async (req, res, next) => {
    try {
        await loginSchema.parseAsync({
            body: req.body,
        });
        next();
    } catch (error) {
        handleValidationError(error, res);
    }
};