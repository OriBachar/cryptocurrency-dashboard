import axios from 'axios';
import { ICrypto } from '../types/crypto';
import { Crypto } from '../models/Crypto';

const COINGECKO_API_URL = 'https://api.coingecko.com/api/v3';

export async function getCryptoData(): Promise<ICrypto[]> {
  const response = await axios.get(`${COINGECKO_API_URL}/coins/markets`, {
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
}

export async function getCryptocurrencyById(id: string): Promise<ICrypto | null> {
  const response = await axios.get(`${COINGECKO_API_URL}/coins/${id}`);
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
}

export async function saveCryptoData(): Promise<ICrypto[]> {
  const cryptoData = await getCryptoData();
  await Crypto.insertMany(cryptoData);
  return cryptoData;
}