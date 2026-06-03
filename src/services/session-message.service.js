import { createMessage } from './message.service.js';
import { enqueueTextMessage, enqueueMediaMessage } from './message-dispatch.service.js';

export async function relayTextToSender({ sessionId, senderTo, text }) {
  await createMessage({
    sessionId,
    direction: 'inbound',
    messageType: 'text',
    body: text,
    status: 'received'
  });

  return enqueueTextMessage({
    sessionId,
    to: senderTo,
    text
  });
}

export async function relayMediaToSender({ sessionId, senderTo, mediaUrl, caption = '' }) {
  await createMessage({
    sessionId,
    direction: 'inbound',
    messageType: 'media',
    body: caption || null,
    mediaUrl,
    status: 'received'
  });

  return enqueueMediaMessage({
    sessionId,
    to: senderTo,
    mediaUrl,
    caption
  });
}