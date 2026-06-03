export function buildPrettyResponse(title, lines, footer = '') {
  return [
    `*${title}*`,
    '',
    ...lines.map((line) => `• ${line}`),
    footer ? '' : null,
    footer || null
  ].filter(Boolean).join('\n');
}