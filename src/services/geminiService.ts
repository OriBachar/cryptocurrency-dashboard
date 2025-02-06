import { GoogleGenerativeAI } from '@google/generative-ai';
import { config } from '../config/env';

const genAI = new GoogleGenerativeAI(config.gemini.apiKey);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

export const analyzeCrypto = async (cryptoId: string): Promise<string> => {
  try {
    const prompt = `Analyze the cryptocurrency ${cryptoId}. Include:
              - Recent price trends
              - Notable market events
              - Key factors affecting its value
              - Market sentiment
              Please keep the analysis concise and focused.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API error:', error);
    throw error;
  }
};