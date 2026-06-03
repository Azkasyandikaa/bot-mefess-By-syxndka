import { createMessage } from './message.service.js';

export async function notifySender(sessionId, text) {
  return createMessage({
    sessionId,
    direction: 'system',
    messageType: 'text',
    body: text,
    status: 'queued'
  });
}