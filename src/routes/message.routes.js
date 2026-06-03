import { enqueueTextMessage, enqueueMediaMessage } from '../services/message-dispatch.service.js';

export async function sendText(req, res, next) {
  try {
    const { sessionId, to, text } = req.body;

    if (!sessionId || !to || !text) {
      return res.status(400).json({ ok: false, message: 'sessionId, to, text are required' });
    }

    const result = await enqueueTextMessage({ sessionId, to, text });
    return res.json({ ok: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function sendMedia(req, res, next) {
  try {
    const { sessionId, to, mediaUrl, caption } = req.body;

    if (!sessionId || !to || !mediaUrl) {
      return res.status(400).json({ ok: false, message: 'sessionId, to, mediaUrl are required' });
    }

    const result = await enqueueMediaMessage({ sessionId, to, mediaUrl, caption });
    return res.json({ ok: true, ...result });
  } catch (error) {
    next(error);
  }
}