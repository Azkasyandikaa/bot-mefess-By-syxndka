import { Queue } from 'bullmq';
import Redis from 'ioredis';
import { env } from '../config/env.js';

const connection = new Redis({
  host: env.redisHost,
  port: Number(env.redisPort || 6379),
  password: env.redisPassword || undefined
});

export const messageQueue = new Queue('message-queue', {
  connection
});