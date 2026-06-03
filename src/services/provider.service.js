import fs from 'fs';
import path from 'path';
import { providerClient } from '../config/provider.js';
import { env } from '../config/env.js';

function fileToBase64(filePath) {
  const absolutePath = path.resolve(filePath);
  const buffer = fs.readFileSync(absolutePath);
  return buffer.toString('base64');
}

async function postMessage(endpoint, payload) {
  const { data } = await providerClient.post(endpoint, payload);
  return data;
}

export async function sendTextMessage({ to, text, typingTime = 0 }) {
  return postMessage('/messages/text', {
    to,
    body: text,
    typing_time: typingTime
  });
}

export async function sendMediaMessage({ to, mediaUrl, caption = '' }) {
  return postMessage('/messages/image', {
    to,
    mediaUrl,
    caption
  });
}

export async function sendStickerMessage({ to, mediaUrl }) {
  return postMessage('/messages/sticker', {
    to,
    mediaUrl
  });
}

export async function sendAudioMessage({ to, mediaUrl }) {
  return postMessage('/messages/audio', {
    to,
    mediaUrl
  });
}

export async function sendVideoMessage({ to, mediaUrl, caption = '' }) {
  return postMessage('/messages/video', {
    to,
    mediaUrl,
    caption
  });
}

export async function sendThumbnailMessage({ to, caption = '' }) {
  const thumbnailPath = env.thumbnailPath || 'assets/thumbnail.jpg';
  const base64 = fileToBase64(thumbnailPath);

  return postMessage('/messages/image-base64', {
    to,
    mimeType: 'image/jpeg',
    fileName: path.basename(thumbnailPath),
    base64,
    caption
  });
}