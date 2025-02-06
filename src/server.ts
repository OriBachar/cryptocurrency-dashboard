import express from 'express';
import errorHandler from 'errorhandler';
import cors from 'cors';
import { connectDB } from './config/database';
import { config } from './config/env';
import authRoutes from './routes/authRoutes';
import cryptoRoutes from './routes/cryptoRoutes';
import watchlistRoutes from './routes/watchlistRoutes';
import cryptoAnalysisRoutes from './routes/cryptoAnalysisRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Request Method: ${req.method}, Path: ${req.path}`);
  next();
});

app.use('/api/auth', authRoutes);
app.use('/api/cryptos', cryptoRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/analysisCrypto', cryptoAnalysisRoutes);

app.use(errorHandler());


const PORT = config.port || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDB();
});