import { Router } from 'express';
import { auth } from '../middleware/auth';
import {
  getAllCryptos,
  getCryptoById,
  refreshCryptoData
} from '../controllers/cryptoController';

const router = Router();

router.get('/', getAllCryptos);
router.get('/:id', getCryptoById);
router.post('/refresh', auth, refreshCryptoData);

export default router;