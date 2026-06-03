import { normalizePhoneNumber } from '../utils/normalize-number.js';
import { createSession } from '../services/session.service.js';
import { sendThumbnailMessage } from '../services/provider.service.js';
import { env } from '../config/env.js';

export async function handleConfessCommand({ senderUserId, targetWaId, targetName, caption }) {
  const session = await createSession({
    senderUserId,
    targetWaId: normalizePhoneNumber(targetWaId),
    targetName,
    sourceType: 'confess'
  });

  if (env.enableThumbnail) {
    await sendThumbnailMessage({
      to: targetWaId,
      caption: caption || `Menfess diterima dari ${targetName || 'anonim'}`
    });
  }

  return {
    ok: true,
    session,
    message: 'Confess session created'
  };
}