import { RequestHandler } from 'express';
import { analyzeCrypto } from '../services/geminiService';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../types/error';

export const getAnalysis: RequestHandler = asyncHandler(async (req, res) => {
    const cryptoId = req.params.id;
    if (!cryptoId) {
        throw new AppError('Cryptocurrency ID is required', 400);
    }

    const analysis = await analyzeCrypto(cryptoId);
    if (!analysis) {
        throw new AppError('Failed to generate analysis', 500);
    }
    
    res.status(200).json({ 
        status: 'success',
        data: {
            response: analysis,
            provider: 'Gemini'
        }
    });
});