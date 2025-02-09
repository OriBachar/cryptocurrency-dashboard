import mongoose, { set } from 'mongoose';
import { config } from './env';

const MAX_RETRIES = 5;
const RETRY_INTERVAL = 5000;

export const connectDB = async (attempt = 1): Promise<void> => {
    try {
        await mongoose.connect(`${config.mongodb.uri}/${config.mongodb.dbName}`);
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.error(`MongoDB connection error attempt ${attempt}/${MAX_RETRIES}:`, error);
        if(attempt < MAX_RETRIES) {
            console.log(`Retrying in ${RETRY_INTERVAL / 1000} seconds...`);
            setTimeout(() => connectDB(attempt + 1), RETRY_INTERVAL);
        }
        else {
            console.error('Max retries reached. Exiting...');
            process.exit(1);
        }
        
    }
};