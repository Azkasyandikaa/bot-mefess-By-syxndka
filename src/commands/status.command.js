import { getActiveSessionBySender } from '../services/session.service.js';

export async function handleStatusCommand({ senderUserId }) {
  const active = await getActiveSessionBySender(senderUserId);

  if (!active) {
    return {
      ok: true,
      status: 'idle'
    };
  }

  return {
    ok: true,
    status: 'active',
    session: active
  };
}