import { Router } from 'express';
import authRoutes from './authRoutes';
import cryptoRoutes from './cryptoRoutes';
import watchlistRoutes from './watchlistRoutes';
import cryptoAnalysisRoutes from './cryptoAnalysisRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/cryptos', cryptoRoutes);
router.use('/watchlist', watchlistRoutes);
router.use('/analysisCrypto', cryptoAnalysisRoutes);

export default router;
