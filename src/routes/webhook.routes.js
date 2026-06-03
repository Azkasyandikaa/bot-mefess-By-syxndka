import { handleInboundMessage, handleStatusUpdate } from '../services/inbound-router.service.js';

export async function inboundWebhook(req, res, next) {
  try {
    await handleInboundMessage(req.body);
    return res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
}

export async function statusWebhook(req, res, next) {
  try {
    await handleStatusUpdate(req.body);
    return res.status(200).json({ ok: true });
  } catch (error) {
    next(error);
  }
}