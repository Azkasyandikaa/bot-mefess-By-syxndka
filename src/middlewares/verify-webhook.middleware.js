import crypto from 'crypto';
import { env } from '../config/env.js';

export function verifyWebhook(req, res, next) {
  try {
    const signature = req.headers['x-webhook-signature'];
    const rawBody = req.rawBody;

    if (!env.webhookSecret) {
      return res.status(500).json({ ok: false, message: 'WEBHOOK_SECRET missing' });
    }

    if (!signature || !rawBody) {
      return res.status(401).json({ ok: false, message: 'Unauthorized' });
    }

    const expected = crypto
      .createHmac('sha256', env.webhookSecret)
      .update(rawBody)
      .digest('hex');

    const valid =
      signature.length === expected.length &&
      crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected));

    if (!valid) {
      return res.status(401).json({ ok: false, message: 'Invalid signature' });
    }

    next();
  } catch (error) {
    next(error);
  }
}