export interface ICrypto {
    id: string;
    name: string;
    symbol: string;
    currentPrice: number;
    marketCap?: number;
    priceChange24h?: number;
    imageUrl?: string;
    lastUpdated: Date;
}