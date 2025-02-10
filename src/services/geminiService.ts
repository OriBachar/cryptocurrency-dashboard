import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';
import { AppError } from '../types/error';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const analyzeCrypto = async (cryptoId: string): Promise<string> => {
  try {
    if (!cryptoId) {
      throw new AppError('Cryptocurrency ID is required', 400);
    }

    const prompt = `Analyze the cryptocurrency ${cryptoId}. Include:
                - Recent price trends
                - Notable market events
                - Key factors affecting its value
                - Market sentiment
                Please keep the analysis concise and focused.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;

    if (!response.text()) {
      throw new AppError('Failed to generate analysis', 500);
    }

    return response.text();
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    
    throw new AppError(
      'Error generating cryptocurrency analysis',
      500
    );
  }
};