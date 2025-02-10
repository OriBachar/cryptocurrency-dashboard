import { RequestHandler } from 'express';
import { IUser } from '../types/user';
import { User } from '../models/User';
import { Crypto } from '../models/Crypto';
import { getCryptocurrencyById } from '../services/cryptoAPI';
import mongoose from 'mongoose';
import { asyncHandler } from '../utils/asyncHandler';
import { AppError } from '../types/error';

declare global {
    namespace Express {
        interface Request {
            user: IUser;
        }
    }
}

type WatchlistItem = {
    crypto: mongoose.Types.ObjectId;
    name: string;
    id: string;
    addedAt?: Date;
};

export const getWatchlist: RequestHandler = asyncHandler(async (req, res) => {
    res.status(200).json({
        status: 'success',
        data: req.user.watchlist
    });
});

export const addToWatchlist: RequestHandler = asyncHandler(async (req, res) => {
    const { cryptoId } = req.body;
    
    if (!cryptoId) {
        throw new AppError('Cryptocurrency ID is required', 400);
    }
    
    let crypto = await Crypto.findOne({ id: cryptoId });

    if (!crypto) {
        const newCrypto = await getCryptocurrencyById(cryptoId);
        if (!newCrypto) {
            throw new AppError('Cryptocurrency not found', 404);
        }
        crypto = await new Crypto(newCrypto).save();
    }

    const alreadyInWatchlist = req.user.watchlist.some(
        (item: WatchlistItem) => item.id === cryptoId
    );

    if (alreadyInWatchlist) {
        throw new AppError('Cryptocurrency already in watchlist', 400);
    }

    req.user.watchlist.push({
        crypto: new mongoose.Types.ObjectId(crypto._id),
        name: crypto.name,
        id: crypto.id,
        addedAt: new Date()
    });
    
    await req.user.save();

    res.status(200).json({
        status: 'success',
        message: `Cryptocurrency ${cryptoId} added to watchlist`,
        data: req.user.watchlist
    });
});

export const removeFromWatchlist: RequestHandler = asyncHandler(async (req, res) => {
    const { cryptoId } = req.body;

    if (!cryptoId) {
        throw new AppError('Cryptocurrency ID is required', 400);
    }

    const cryptoInWatchlist = req.user.watchlist.some(
        (item: WatchlistItem) => item.id === cryptoId
    );

    if (!cryptoInWatchlist) {
        throw new AppError('Cryptocurrency not found in watchlist', 404);
    }

    req.user.watchlist = req.user.watchlist.filter(
        (item: WatchlistItem) => item.id !== cryptoId
    );
    
    await req.user.save();

    res.status(200).json({
        status: 'success',
        message: `Cryptocurrency ${cryptoId} removed from watchlist`,
        data: req.user.watchlist
    });
});