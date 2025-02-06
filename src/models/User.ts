import mongoose from 'mongoose';
import { IUser } from '../types/user';

const userSchema = new mongoose.Schema<IUser>({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    watchlist: [{
        crypto: { type: mongoose.Schema.Types.ObjectId, ref: 'Crypto' },
        name: { type: String, required: true },
        id: { type: String, required: true },
        addedAt: { type: Date, default: Date.now }
    }],
    token:  { type: String },
    createdAt: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', userSchema);