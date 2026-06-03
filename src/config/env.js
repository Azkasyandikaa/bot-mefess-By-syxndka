import dotenv from 'dotenv';

dotenv.config();

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,

  apiKey: process.env.API_KEY || process.env.BOT_API_KEY || process.env.INTERNAL_API_KEY,

  redisHost: process.env.REDIS_HOST || '127.0.0.1',
  redisPort: process.env.REDIS_PORT || 6379,
  redisPassword: process.env.REDIS_PASSWORD || '',

  dbHost: process.env.DB_HOST || '127.0.0.1',
  dbPort: process.env.DB_PORT || 5432,
  dbName: process.env.DB_NAME || 'app_db',
  dbUser: process.env.DB_USER || 'postgres',
  dbPassword: process.env.DB_PASSWORD || '',

  thumbnailPath: process.env.THUMBNAIL_PATH || 'assets/thumbnail.jpg',
  enableThumbnail: String(process.env.ENABLE_THUMBNAIL || 'true') === 'true',
  providerBaseUrl: process.env.PROVIDER_BASE_URL || 'https://api.provider.local',
  providerToken: process.env.PROVIDER_TOKEN || ''
};