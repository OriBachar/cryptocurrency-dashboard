import dotenv from 'dotenv';
import path from 'path';
dotenv.config({ path: path.resolve(__dirname, '../../.env') });

export const config = {
    port: process.env.PORT,
    mongodb: {
        uri: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017',
        dbName: process.env.DB_NAME || 'mydb'
    },
    jwt: {
        secret: process.env.JWT_SECRET || (() => {
            throw new Error('JWT_SECRET environment variable is required')
        })()
    },
    aws: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION,
        s3Bucket: process.env.AWS_S3_BUCKET
    },
    coinGecko: {
        apiKey: process.env.COINGECKO_API_KEY
    },
    gemini: {
        apiKey: process.env.GEMINI_API_KEY || (() => {
            throw new Error('GEMINI_API_KEY environment variable is required')
        })()
    }
};