import { Worker } from 'bullmq';
import IORedis from 'ioredis';
import { env } from '../config/env.js';
import {
  sendTextMessage,
  sendMediaMessage,
  sendStickerMessage,
  sendAudioMessage,
  sendVideoMessage
} from '../services/provider.service.js';
import { updateMessageStatus } from '../services/status.service.js';
import { logger } from '../config/logger.js';

const connection = new IORedis({
  host: env.redisHost,
  port: Number(env.redisPort || 6379),
  password: env.redisPassword || undefined,
  maxRetriesPerRequest: null
});

const worker = new Worker(
  'message-queue',
  async (job) => {
    const { type, to, text, mediaUrl, caption, messageId } = job.data;

    logger.info({ jobId: job.id, type }, 'Processing queue job');

    let result;

    switch (type) {
      case 'text':
        result = await sendTextMessage({ to, text });
        break;
      case 'media':
        result = await sendMediaMessage({ to, mediaUrl, caption });
        break;
      case 'sticker':
        result = await sendStickerMessage({ to, mediaUrl });
        break;
      case 'audio':
        result = await sendAudioMessage({ to, mediaUrl });
        break;
      case 'video':
        result = await sendVideoMessage({ to, mediaUrl, caption });
        break;
      default:
        throw new Error(`Unknown message type: ${type}`);
    }

    const providerMessageId =
      result?.providerMessageId ||
      result?.messageId ||
      result?.id ||
      messageId;

    if (providerMessageId) {
      await updateMessageStatus(providerMessageId, 'sent');
    }

    return result;
  },
  { connection }
);

worker.on('completed', (job) => {
  logger.info({ jobId: job.id }, 'Job completed');
});

worker.on('failed', (job, err) => {
  logger.error({ jobId: job?.id, err: err.message }, 'Job failed');
});

process.on('SIGINT', async () => {
  await worker.close();
  await connection.quit();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await worker.close();
  await connection.quit();
  process.exit(0);
});;