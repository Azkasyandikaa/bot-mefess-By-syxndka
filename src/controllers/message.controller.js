import { enqueueTextMessage, enqueueMediaMessage } from '../services/message-dispatch.service.js';

export async function sendText(req, res) {
  try {
    const { sessionId, to, text } = req.body;

    if (!sessionId || !to || !text) {
      return res.status(400).json({ ok: false, message: 'sessionId, to, text required' });
    }

    const result = await enqueueTextMessage({ sessionId, to, text });
    return res.json({ ok: true, ...result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Failed to send text' });
  }
}

export async function sendMedia(req, res) {
  try {
    const { sessionId, to, mediaUrl, caption } = req.body;

    if (!sessionId || !to || !mediaUrl) {
      return res.status(400).json({ ok: false, message: 'sessionId, to, mediaUrl required' });
    }

    const result = await enqueueMediaMessage({ sessionId, to, mediaUrl, caption });
    return res.json({ ok: true, ...result });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ ok: false, message: 'Failed to send media' });
  }
}