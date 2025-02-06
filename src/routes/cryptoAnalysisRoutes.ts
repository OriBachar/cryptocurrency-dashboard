import { Router } from 'express';
import { getAnalysis } from '../controllers/cryptoAnalysisController';
const router = Router();

router.get('/:id', getAnalysis);

export default router;