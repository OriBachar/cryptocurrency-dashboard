import express from 'express';
import { auth } from '../middleware/auth';
import {
    addToWatchlist,
    removeFromWatchlist,
    getWatchlist
} from '../controllers/watchlistController';

const router = express.Router();

router.use(auth);

router.get('/', getWatchlist);
router.post('/', addToWatchlist);
router.delete('/', removeFromWatchlist);

export default router;