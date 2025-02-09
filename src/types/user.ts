import mongoose, { Document } from 'mongoose';

export enum UserRole {
    USER = "user",
    ADMIN = "admin"
}

export interface IUser extends Document {
    _id: string;
    email: string;
    password: string;
    role: UserRole;
    watchlist: {
        crypto: mongoose.Types.ObjectId;
        name: string;
        id: string;
        addedAt?: Date;
    }[];
    createdAt: Date;
}