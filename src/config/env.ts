import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

const getEnv = (key: string, required = false): string => {
    const value = process.env[key];
    if (required && !value) {
        throw new Error(`Environment variable ${key} is required`);
    }
    return value || '';
}

export const config = {
    server:{
        port: getEnv('PORT') || '3000',
        env:  getEnv('NODE_ENV') || 'development',
        whitelist: getEnv('CORS_WHITELIST') ? getEnv('CORS_WHITELIST').split(',') : []
    },
    mongodb: {
        uri: getEnv('MONGODB_URI' , true),
        dbName: getEnv('DB_NAME', true)
    },
    jwt: {
        secret:  getEnv('JWT_SECRET', true)
    },
    aws: {
        accessKeyId: getEnv('AWS_ACCESS_KEY_ID'),
        secretAccessKey: getEnv('AWS_SECRET_ACCESS_KEY'),
        region: getEnv('AWS_REGION'),
        s3Bucket: getEnv('AWS_S3_BUCKET')
    },
    coinGecko: {
        apiKey: getEnv('COINGECKO_API_KEY')
    },
    gemini: {
        apiKey: getEnv('GEMINI_API_KEY', true)
    }
};