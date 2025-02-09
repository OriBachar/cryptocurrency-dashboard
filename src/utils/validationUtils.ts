import { Response } from 'express';
import { ZodError } from 'zod';

export const handleValidationError = (error: unknown, res: Response) => {
    if (error instanceof ZodError) {
        return res.status(400).json({
            status: 'error',
            errors: error.errors.map(err => ({
                field: err.path.join('.'),
                message: err.message
            }))
        });
    }
    throw error;
};