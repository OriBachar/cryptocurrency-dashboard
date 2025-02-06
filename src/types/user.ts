import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    watchlist: {
        crypto: mongoose.Types.ObjectId;
        name: string;
        id: string;
        addedAt?: Date;
    }[];
    token: string;
    createdAt: Date;
}