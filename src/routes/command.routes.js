import { Router } from 'express';
import { authMiddleware } from '../middlewares/auth.middleware.js';
import {
  handleHelpCommand,
  handleStatusCommand,
  handleStopConfessCommand
} from '../controllers/command.controller.js';

const router = Router();

router.get('/help', authMiddleware, (req, res) => {
  return res.status(200).json({
    ok: true,
    message: handleHelpCommand()
  });
});

router.get('/status', authMiddleware, (req, res) => {
  const session = req.sessionData || null;

  return res.status(200).json({
    ok: true,
    message: handleStatusCommand({ session })
  });
});

router.post('/stopconfess', authMiddleware, (req, res) => {
  return res.status(200).json({
    ok: true,
    message: handleStopConfessCommand()
  });
});

export default router;