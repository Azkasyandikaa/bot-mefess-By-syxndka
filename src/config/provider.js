import axios from 'axios';
import { env } from './env.js';

export const providerClient = axios.create({
  baseURL: process.env.PROVIDER_BASE_URL || env.providerBaseUrl || 'https://api.provider.local',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Authorization: process.env.PROVIDER_TOKEN
      ? `Bearer ${process.env.PROVIDER_TOKEN}`
      : undefined
  }
});