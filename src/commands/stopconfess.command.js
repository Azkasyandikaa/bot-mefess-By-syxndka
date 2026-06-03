import { getActiveSessionBySender, closeSession } from '../services/session.service.js';

export async function handleStopConfessCommand({ senderUserId }) {
  const active = await getActiveSessionBySender(senderUserId);

  if (!active) {
    return {
      ok: false,
      message: 'Tidak ada session aktif'
    };
  }

  const closed = await closeSession(active.id);

  return {
    ok: true,
    session: closed,
    message: 'Session stopped'
  };
}