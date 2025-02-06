import { RequestHandler } from 'express';
import { IUser } from '../types/user';
import { User } from '../models/User';
import { Crypto } from '../models/Crypto';
import { getCryptocurrencyById } from '../services/cryptoAPI';
import mongoose from 'mongoose';

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

export const getWatchlist: RequestHandler = async (req, res, next) => {
    try {
        res.status(200).json(req.user.watchlist);
    } catch (error) {
        next(error);
    }
}


export const addToWatchlist: RequestHandler = async (req, res, next) => {
    try {
        const { cryptoId } = req.body;
        
        let crypto = await Crypto.findOne({ id: cryptoId });

        if (!crypto) {
            const newCrypto = await getCryptocurrencyById(cryptoId);
            if (!newCrypto) {
                return res.status(404).json({ error: 'Cryptocurrency not found' });
            }
            crypto = await new Crypto(newCrypto).save();
        }

        const alreadyInWatchlist = req.user.watchlist.some(
            (item: WatchlistItem) => item.id === cryptoId
        );

        if (alreadyInWatchlist) {
            return res.status(400).json({ error: 'Cryptocurrency already in watchlist' });
        }

        req.user.watchlist.push( {
            crypto: new mongoose.Types.ObjectId(crypto._id),
            name: crypto.name,
            id: crypto.id,
            addedAt: new Date()
        });
        
        await req.user.save();
        res.status(200).json(`Cryptocurrency ${cryptoId} added to watchlist`);
    } catch (error) {
        next(error);
    }
}

export const removeFromWatchlist: RequestHandler = async (req, res, next) => {
    try {
        const { cryptoId } = req.body;

        const cryptoInWatchlist = req.user.watchlist.some(
            (item: WatchlistItem) => item.id === cryptoId
        );

        if (!cryptoInWatchlist) {
            return res.status(404).json({ error: 'Cryptocurrency not found in watchlist' });
        }

        req.user.watchlist = req.user.watchlist.filter(
            (item: WatchlistItem) => item.id !== cryptoId
        );
        
        await req.user.save();
        res.status(200).json(`Cryptocurrency ${cryptoId} removed from watchlist`);
    } catch (error) {
        next(error);
    }
}