import mongoose from 'mongoose';
import { ICrypto } from '../types/crypto';

const cryptoSchema = new mongoose.Schema<ICrypto>({
    id: { type: String, required: true },
    name: { type: String, required: true },
    symbol: { type: String, required: true },
    currentPrice: { type: Number, required: true },
    marketCap: { type: Number },
    priceChange24h: { type: Number },
    imageUrl: { type: String },
    lastUpdated: { type: Date, default: Date.now }
});

export const Crypto = mongoose.model<ICrypto>('Crypto', cryptoSchema);