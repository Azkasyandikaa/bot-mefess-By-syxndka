import { buildPrettyResponse } from '../utils/response.helper.js';

export function handleHelpCommand() {
  return buildPrettyResponse(
    '📖 Menfess Bot',
    [
      '.confess — mulai menfess',
      '.stopconfess — hentikan session',
      '.status — cek status session',
      'Text, foto, video, audio, dan stiker ikut bisa di-relay'
    ],
    '_Ketik command sesuai format ya._'
  );
}

export function handleStatusCommand({ session }) {
  if (!session) {
    return [
      '*🫧 Status Menfess*',
      '',
      'Belum ada session aktif.',
      '',
      '_Ketik .confess untuk mulai._'
    ].join('\n');
  }

  return buildPrettyResponse(
    '💌 Status Menfess',
    [
      `Session ID: ${session.id}`,
      `Role: ${session.participant_role || '-'}`,
      `Target: ${session.target_wa_id}`,
      `Status: ${session.status}`
    ],
    '_Session masih aktif._'
  );
}

export function handleStopConfessCommand() {
  return [
    '*🛑 Menfess dihentikan*',
    '',
    'Session sudah ditutup.',
    'Terima kasih sudah pakai bot ini.'
  ].join('\n');
}