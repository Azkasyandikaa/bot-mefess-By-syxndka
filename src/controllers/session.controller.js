import {
  createSession,
  getActiveSessionBySenderWaId,
  getActiveSessionByTargetWaId,
  closeSession
} from '../services/session.service.js';
import { normalizePhoneNumber } from '../utils/normalize-number.js';
import { sendSessionThumbnail } from '../services/message-dispatch.service.js';

function buildPrettyResponse(title, lines, footer = '') {
  return [
    `*${title}*`,
    '',
    ...lines.map((line) => `• ${line}`),
    footer ? '' : null,
    footer || null
  ].filter(Boolean).join('\n');
}

function ok(res, message, data = null) {
  return res.status(200).json({
    ok: true,
    message,
    data
  });
}

function fail(res, status, message, details = null) {
  return res.status(status).json({
    ok: false,
    message,
    details
  });
}

export async function startSession(req, res, next) {
  try {
    const { senderUserId, senderWaId, targetWaId, targetName, caption } = req.body;

    if (!senderUserId || !senderWaId || !targetWaId) {
      return fail(res, 400, 'senderUserId, senderWaId, dan targetWaId wajib diisi');
    }

    const normalizedSenderWaId = normalizePhoneNumber(senderWaId);
    const normalizedTargetWaId = normalizePhoneNumber(targetWaId);

    const session = await createSession({
      senderUserId,
      senderWaId: normalizedSenderWaId,
      targetWaId: normalizedTargetWaId,
      targetName: targetName || null,
      sourceType: 'confess'
    });

    await sendSessionThumbnail({
      to: normalizedTargetWaId,
      caption:
        caption ||
        buildPrettyResponse(
          '💌 Menfess diterima',
          [
            'Kamu baru aja menerima pesan anonim.',
            'Balas chat ini untuk mulai ngobrol.'
          ],
          '_Jaga sopan santun ya._'
        )
    });

    return ok(res, 'Session berhasil dibuat', session);
  } catch (error) {
    next(error);
  }
}

export async function stopSession(req, res, next) {
  try {
    const { senderWaId } = req.body;

    if (!senderWaId) {
      return fail(res, 400, 'senderWaId wajib diisi');
    }

    const normalizedSenderWaId = normalizePhoneNumber(senderWaId);
    const session = await getActiveSessionBySenderWaId(normalizedSenderWaId);

    if (!session) {
      return fail(res, 404, 'Tidak ada session aktif untuk sender ini');
    }

    const closed = await closeSession(session.id);
    return ok(res, 'Session berhasil dihentikan', closed);
  } catch (error) {
    next(error);
  }
}

export async function getSessionStatus(req, res, next) {
  try {
    const { senderWaId } = req.params;

    if (!senderWaId) {
      return fail(res, 400, 'senderWaId wajib diisi');
    }

    const normalizedSenderWaId = normalizePhoneNumber(senderWaId);

    const bySender = await getActiveSessionBySenderWaId(normalizedSenderWaId);
    if (bySender) {
      return ok(res, 'Session aktif ditemukan', {
        role: 'sender',
        session: bySender
      });
    }

    const byTarget = await getActiveSessionByTargetWaId(normalizedSenderWaId);
    if (byTarget) {
      return ok(res, 'Session aktif ditemukan', {
        role: 'target',
        session: byTarget
      });
    }

    return ok(res, 'Tidak ada session aktif', {
      role: 'none',
      session: null
    });
  } catch (error) {
    next(error);
  }
}