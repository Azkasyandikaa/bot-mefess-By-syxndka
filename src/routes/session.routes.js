import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  startSession,
  stopSession,
  getSessionStatus
} from '../controllers/session.controller.js';

const router = Router();

router.post('/start', authMiddleware, startSession);
router.post('/stop', authMiddleware, stopSession);
router.get('/status/:senderWaId', authMiddleware, getSessionStatus);

export default router;