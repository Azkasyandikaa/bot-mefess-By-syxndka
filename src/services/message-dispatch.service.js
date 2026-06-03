import { Queue } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env.js';
import { createMessage } from './message.service.js';
import { sendThumbnailMessage } from './provider.service.js';

const connection = new IORedis({
  host: env.redisHost,
  port: Number(env.redisPort),
  password: env.redisPassword || undefined,
  maxRetriesPerRequest: null
});

export const messageQueue = new Queue('message-queue', {
  connection
});

export async function enqueueTextMessage({ sessionId, to, text }) {
  const record = await createMessage({
    sessionId,
    direction: 'outbound',
    messageType: 'text',
    body: text,
    status: 'queued'
  });

  const job = await messageQueue.add('send-text', {
    type: 'text',
    messageId: record.id,
    sessionId,
    to,
    text
  });

  return { record, jobId: job.id };
}

export async function enqueueMediaMessage({ sessionId, to, mediaUrl, caption = '' }) {
  const record = await createMessage({
    sessionId,
    direction: 'outbound',
    messageType: 'media',
    body: caption || null,
    mediaUrl,
    status: 'queued'
  });

  const job = await messageQueue.add('send-media', {
    type: 'media',
    messageId: record.id,
    sessionId,
    to,
    mediaUrl,
    caption
  });

  return { record, jobId: job.id };
}

export async function enqueueStickerMessage({ sessionId, to, mediaUrl }) {
  const record = await createMessage({
    sessionId,
    direction: 'outbound',
    messageType: 'sticker',
    mediaUrl,
    status: 'queued'
  });

  const job = await messageQueue.add('send-sticker', {
    type: 'sticker',
    messageId: record.id,
    sessionId,
    to,
    mediaUrl
  });

  return { record, jobId: job.id };
}

export async function enqueueAudioMessage({ sessionId, to, mediaUrl }) {
  const record = await createMessage({
    sessionId,
    direction: 'outbound',
    messageType: 'audio',
    mediaUrl,
    status: 'queued'
  });

  const job = await messageQueue.add('send-audio', {
    type: 'audio',
    messageId: record.id,
    sessionId,
    to,
    mediaUrl
  });

  return { record, jobId: job.id };
}

export async function enqueueVideoMessage({ sessionId, to, mediaUrl, caption = '' }) {
  const record = await createMessage({
    sessionId,
    direction: 'outbound',
    messageType: 'video',
    body: caption || null,
    mediaUrl,
    status: 'queued'
  });

  const job = await messageQueue.add('send-video', {
    type: 'video',
    messageId: record.id,
    sessionId,
    to,
    mediaUrl,
    caption
  });

  return { record, jobId: job.id };
}

export async function sendSessionThumbnail({ to, caption = '' }) {
  return sendThumbnailMessage({ to, caption });
}