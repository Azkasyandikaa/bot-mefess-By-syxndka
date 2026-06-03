export function normalizePhoneNumber(input = '') {
  const digits = String(input).replace(/[^\d]/g, '');

  if (!digits) return null;
  if (digits.startsWith('0')) return `62${digits.slice(1)}`;
  if (digits.startsWith('62')) return digits;
  if (digits.startsWith('8')) return `62${digits}`;
  return digits;
}