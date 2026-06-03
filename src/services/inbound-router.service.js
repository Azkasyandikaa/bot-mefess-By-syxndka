import { pool } from '../config/db.js';
import { logger } from '../config/logger.js';
import { normalizePhoneNumber } from '../utils/normalize-number.js';
import { createMessage } from './message.service.js';
import {
  enqueueTextMessage,
  enqueueMediaMessage,
  enqueueStickerMessage,
  enqueueAudioMessage,
  enqueueVideoMessage
} from './message-dispatch.service.js';
import { insertEvent } from '../models/event.model.js';
import { updateSessionActivity } from './session.service.js';

function firstOf(...values) {
  for (const v of values) {
    if (v !== undefined && v !== null && v !== '') return v;
  }
  return null;
}

function extractIncoming(payload) {
  const msg = payload?.messages?.[0] || payload?.entry?.[0]?.changes?.[0]?.value?.messages?.[0] || null;

  const fromRaw = firstOf(
    msg?.from,
    payload?.from,
    payload?.sender,
    payload?.entry?.[0]?.changes?.[0]?.value?.contacts?.[0]?.wa_id
  );

  const type = firstOf(msg?.type, payload?.type, 'text');

  const senderName = firstOf(
    msg?.profile?.name,
    payload?.senderName,
    payload?.name,
    payload?.contactName,
    'Seseorang'
  );

  const messageText = firstOf(
    msg?.text?.body,
    msg?.body,
    payload?.text,
    payload?.message,
    ''
  );

  const mediaUrl = firstOf(
    msg?.image?.link,
    msg?.video?.link,
    msg?.audio?.link,
    msg?.sticker?.link,
    msg?.document?.link,
    payload?.mediaUrl
  );

  return {
    from: fromRaw ? normalizePhoneNumber(fromRaw) : null,
    type,
    senderName,
    messageText,
    mediaUrl,
    raw: msg || payload
  };
}

async function findActiveSessionByWaId(waId) {
  const result = await pool.query(
    `
    SELECT
      s.*,
      CASE
        WHEN s.target_wa_id = $1 THEN 'target'
        WHEN s.sender_wa_id = $1 THEN 'sender'
        ELSE NULL
      END AS participant_role,
      CASE
        WHEN s.target_wa_id = $1 THEN s.sender_wa_id
        WHEN s.sender_wa_id = $1 THEN s.target_wa_id
        ELSE NULL
      END AS relay_to
    FROM sessions s
    WHERE s.status = 'active'
      AND (s.target_wa_id = $1 OR s.sender_wa_id = $1)
    ORDER BY s.started_at DESC
    LIMIT 1
    `,
    [waId]
  );

  return result.rows[0] || null;
}

function buildRelayText({ senderName, messageText }) {
  return [
    '💌 *Halo, ada menfess nih*',
    '',
    `*Dari:* ${senderName || 'Seseorang'}`,
    '',
    '*Pesan:*',
    messageText,
    '',
    '_Balas pesan ini kalau mau lanjut._'
  ].join('\n');
}

function buildMediaCaption({ senderName, mediaType, messageText }) {
  const label = {
    media: '📎 media',
    sticker: '🧩 stiker',
    audio: '🎵 audio',
    video: '🎞️ video'
  }[mediaType] || '📎 media';

  return [
    '💌 *Halo, ada menfess nih*',
    '',
    `*Dari:* ${senderName || 'Seseorang'}`,
    `*Tipe:* ${label}`,
    messageText ? '' : '_Tanpa caption_',
    messageText ? `*Caption:* ${messageText}` : null,
    '',
    '_Balas pesan ini kalau mau lanjut._'
  ].filter(Boolean).join('\n');
}

export async function handleInboundMessage(payload) {
  const incoming = extractIncoming(payload);

  if (!incoming.from) {
    logger.warn({ payload }, 'Inbound payload missing sender');
    return null;
  }

  const session = await findActiveSessionByWaId(incoming.from);

  if (!session) {
    await insertEvent({
      sessionId: null,
      messageId: null,
      eventType: 'inbound_without_session',
      payload: incoming.raw
    });
    return null;
  }

  const messageType = (() => {
    if (incoming.type === 'image') return 'media';
    if (incoming.type === 'video') return 'video';
    if (incoming.type === 'audio') return 'audio';
    if (incoming.type === 'sticker') return 'sticker';
    if (incoming.type === 'media') return 'media';
    return 'text';
  })();

  const inboundRecord = await createMessage({
    sessionId: session.id,
    direction: 'inbound',
    messageType,
    body: incoming.messageText || null,
    mediaUrl: incoming.mediaUrl || null,
    status: 'received'
  });

  await insertEvent({
    sessionId: session.id,
    messageId: inboundRecord.id,
    eventType: `inbound_${messageType}`,
    payload: incoming.raw
  });

  await updateSessionActivity(session.id);

  const relayTo = session.relay_to;

  if (!relayTo) {
    logger.warn({ session, incoming }, 'Relay target missing');
    return inboundRecord;
  }

  if (messageType === 'text') {
    if (incoming.messageText) {
      await enqueueTextMessage({
        sessionId: session.id,
        to: relayTo,
        text: buildRelayText({
          senderName: incoming.senderName,
          messageText: incoming.messageText
        })
      });
    }
    return inboundRecord;
  }

  if (messageType === 'media') {
    if (incoming.mediaUrl) {
      await enqueueMediaMessage({
        sessionId: session.id,
        to: relayTo,
        mediaUrl: incoming.mediaUrl,
        caption: buildMediaCaption({
          senderName: incoming.senderName,
          mediaType: 'media',
          messageText: incoming.messageText || ''
        })
      });
    }
    return inboundRecord;
  }

  if (messageType === 'sticker') {
    if (incoming.mediaUrl) {
      await enqueueStickerMessage({
        sessionId: session.id,
        to: relayTo,
        mediaUrl: incoming.mediaUrl
      });
    }
    return inboundRecord;
  }

  if (messageType === 'audio') {
    if (incoming.mediaUrl) {
      await enqueueAudioMessage({
        sessionId: session.id,
        to: relayTo,
        mediaUrl: incoming.mediaUrl
      });
    }
    return inboundRecord;
  }

  if (messageType === 'video') {
    if (incoming.mediaUrl) {
      await enqueueVideoMessage({
        sessionId: session.id,
        to: relayTo,
        mediaUrl: incoming.mediaUrl,
        caption: buildMediaCaption({
          senderName: incoming.senderName,
          mediaType: 'video',
          messageText: incoming.messageText || ''
        })
      });
    }
    return inboundRecord;
  }

  if (incoming.messageText) {
    await enqueueTextMessage({
      sessionId: session.id,
      to: relayTo,
      text: buildRelayText({
        senderName: incoming.senderName,
        messageText: incoming.messageText
      })
    });
  }

  return inboundRecord;
}

export async function handleStatusUpdate(payload) {
  const items = payload?.statuses
    ? payload.statuses
    : payload?.status
      ? [payload.status]
      : Array.isArray(payload)
        ? payload
        : [payload];

  for (const item of items) {
    const providerMessageId = item?.id || item?.message_id || item?.providerMessageId;
    const status = item?.status;

    if (!providerMessageId || !status) continue;

    await pool.query(
      `UPDATE messages SET status = $1 WHERE provider_message_id = $2`,
      [status, providerMessageId]
    );

    await insertEvent({
      sessionId: item?.sessionId || null,
      messageId: null,
      eventType: `message_${status}`,
      payload: item
    });
  }
}