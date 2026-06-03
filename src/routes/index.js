import { Router } from 'express';
import healthRoutes from './health.routes.js';
import webhookRoutes from './webhook.routes.js';
import sessionRoutes from './session.routes.js';
import messageRoutes from './message.routes.js';
import commandRoutes from './command.routes.js';

const router = Router();

router.use('/health', healthRoutes);
router.use('/webhook', webhookRoutes);
router.use('/session', sessionRoutes);
router.use('/message', messageRoutes);
router.use('/command', commandRoutes);

export default router;