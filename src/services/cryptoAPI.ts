import axios from 'axios';
import { ICrypto } from '../types/crypto';
import { Crypto } from '../models/Crypto';
import { AppError } from '../types/error';
import { config } from '../config/env';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

const axiosInstance = axios.create({
  baseURL: COINGECKO_API_URL,
  timeout: 10000,
  headers: config.coinGecko.apiKey ? {
    'x-cg-pro-api-key': config.coinGecko.apiKey
  } : {}
});

export const getCryptoData = async (): Promise<ICrypto[]> => {
  try {
    const response = await axiosInstance.get('/coins/markets', {
      params: {
        vs_currency: 'usd',
        order: 'market_cap_desc',
        per_page: 100,
        page: 1,
        sparkline: false,
        price_change_percentage: '24h',
      },
    });

    return response.data.map((coin: any): ICrypto => ({
      id: coin.id,
      name: coin.name,
      symbol: coin.symbol,
      currentPrice: coin.current_price,
      marketCap: coin.market_cap,
      priceChange24h: coin.price_change_24h,
      imageUrl: coin.image,
      lastUpdated: new Date(coin.last_updated),
    }));
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 429) {
        throw new AppError('Rate limit exceeded', 429);
      }
      if (error.response?.status === 404) {
        throw new AppError('Cryptocurrency data not found', 404);
      }
      throw new AppError(
        `Error fetching cryptocurrency data: ${error.response?.data?.error || error.message}`,
        error.response?.status || 500
      );
    }
    throw new AppError('Error fetching cryptocurrency data', 500);
  }
}

export const getCryptocurrencyById = async (id: string): Promise<ICrypto | null> => {
  try {
    const response = await axiosInstance.get(`/coins/${id}`);
    return {
      id: response.data.id,
      name: response.data.name,
      symbol: response.data.symbol,
      currentPrice: response.data.market_data.current_price.usd,
      marketCap: response.data.market_data.market_cap.usd,
      priceChange24h: response.data.market_data.price_change_24h,
      imageUrl: response.data.image.small,
      lastUpdated: new Date(response.data.last_updated),
    };
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) {
        return null;
      }
      if (error.response?.status === 429) {
        throw new AppError('Rate limit exceeded', 429);
      }
      throw new AppError(
        `Error fetching cryptocurrency: ${error.response?.data?.error || error.message}`,
        error.response?.status || 500
      );
    }
    throw new AppError('Error fetching cryptocurrency', 500);
  }
}

export const saveCryptoData = async (): Promise<ICrypto[]> => {
  try {
    const cryptoData = await getCryptoData();
    await Crypto.insertMany(cryptoData);
    return cryptoData;
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }
    throw new AppError('Error saving cryptocurrency data', 500);
  }
}