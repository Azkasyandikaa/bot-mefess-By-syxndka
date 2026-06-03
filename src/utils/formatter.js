export function formatSessionMessage({ name, target, message }) {
  return [
    `Nama: ${name || '-'}`,
    `Target: ${target || '-'}`,
    `Pesan: ${message || '-'}`
  ].join('\n');
}