import { RequestHandler } from 'express';
import { getCryptoData, getCryptocurrencyById, saveCryptoData } from '../services/cryptoAPI';
import { ICrypto } from '../types/crypto';
import { Crypto } from '../models/Crypto';


export const getAllCryptos: RequestHandler = async (req, res, next) => {
    let cryptos = await Crypto.find();
    if(cryptos.length === 0) {
       const cryptoData = await getCryptoData();
       cryptos = await Promise.all(cryptoData.map(data => new Crypto(data).save()));
    }
    res.status(200).json(cryptos);
};


export const getCryptoById: RequestHandler = async (req, res, next) => {
    try {
        const { id } = req.params;
        let crypto = await Crypto.findOne({id: id});

        if (!crypto) {
            const newCrypto = await getCryptocurrencyById(id);
            if (newCrypto) {
                crypto = await new Crypto(newCrypto).save();
            }
        }

        if (!crypto) {
            res.status(404).json({ error: 'Cryptocurrency not found' });
        } else {
            res.status(200).json(crypto);
        }
    } catch (error) {
        next(error);
    }
};

export const refreshCryptoData: RequestHandler = async (req, res, next) => {
    const cryptos = await getCryptoData();
    await Promise.all(cryptos.map(async (crypto) => {
        const existingCrypto = await Crypto.findOne({id: crypto.id});
        if (existingCrypto) {
            existingCrypto.currentPrice = crypto.currentPrice;
            existingCrypto.marketCap = crypto.marketCap;
            existingCrypto.priceChange24h = crypto.priceChange24h;
            existingCrypto.lastUpdated = crypto.lastUpdated;
            await existingCrypto.save();
        } else {
            await new Crypto(crypto).save();
        }
    }));
    res.status(200).json({ message: 'Cryptocurrency data refreshed' });
};