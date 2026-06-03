import pino from 'pino';
import fs from 'fs';
import path from 'path';
import { env } from './env.js';

const logDir = path.resolve('logs');
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const level = env.nodeEnv === 'production' ? 'info' : 'debug';

const transport =
  env.nodeEnv !== 'production'
    ? {
        target: 'pino-pretty',
        options: {
          colorize: true,
          translateTime: 'SYS:standard',
          ignore: 'pid,hostname'
        }
      }
    : undefined;

export const logger = transport
  ? pino({ level, base: null, timestamp: pino.stdTimeFunctions.isoTime, transport })
  : pino({ level, base: null, timestamp: pino.stdTimeFunctions.isoTime });