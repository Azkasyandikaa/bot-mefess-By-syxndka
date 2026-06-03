import { env } from '../config/env.js';

export function authMiddleware(req, res, next) {
  const apiKey = req.headers['x-api-key'];
  const authHeader = req.headers.authorization || '';
  const bearerToken = authHeader.startsWith('Bearer ')
    ? authHeader.slice(7).trim()
    : null;

  const expectedKey = env.apiKey || env.botApiKey || env.internalApiKey;

  if (!expectedKey) {
    return res.status(500).json({
      ok: false,
      message: 'API key belum dikonfigurasi'
    });
  }

  if (apiKey === expectedKey || bearerToken === expectedKey) {
    return next();
  }

  return res.status(401).json({
    ok: false,
    message: 'Unauthorized'
  });
}