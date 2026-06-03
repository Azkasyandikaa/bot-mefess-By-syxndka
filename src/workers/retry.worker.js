import { Worker } from 'bullmq';
import Redis from 'ioredis';
import { env } from '../config/env.js';
import { sendTextMessage, sendMediaMessage } from '../services/provider.service.js';

const connection = new Redis({
  host: env.redisHost,
  port: Number(env.redisPort || 6379),
  password: env.redisPassword || undefined
});

const worker = new Worker(
  'message-queue',
  async (job) => {
    const { type, to, text, mediaUrl, caption } = job.data;

    if (type === 'text') {
      return await sendTextMessage({ to, text });
    }

    if (type === 'media') {
      return await sendMediaMessage({ to, mediaUrl, caption });
    }

    throw new Error(`Unknown job type: ${type}`);
  },
  { connection }
);

worker.on('completed', (job) => {
  console.log(`Completed job ${job.id}`);
});

worker.on('failed', (job, err) => {
  console.error(`Failed job ${job?.id}:`, err.message);
});