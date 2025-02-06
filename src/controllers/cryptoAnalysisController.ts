import { RequestHandler } from 'express';
import { analyzeCrypto } from '../services/geminiService';

export const getAnalysis: RequestHandler = async (req, res) => {
    try {
        const cryptoId = req.params.id;
        const analysis = await analyzeCrypto(cryptoId);
        
        res.status(200).json({ 
            response: analysis,
            provider: 'Gemini'
        });
    } catch (error) {
        console.error('Error in getAnalysis:', error);
        res.status(500).json({
            message: 'Error analyzing cryptocurrency',
            error: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};