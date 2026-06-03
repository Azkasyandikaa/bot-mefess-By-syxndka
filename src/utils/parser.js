export function parseConfessPayload(text) {
  const lines = text.split('\n').map(v => v.trim()).filter(Boolean);

  const data = {};
  for (const line of lines) {
    const [key, ...rest] = line.split(':');
    if (!key || !rest.length) continue;
    data[key.toLowerCase()] = rest.join(':').trim();
  }

  return {
    name: data.name || null,
    target: data.target || null,
    message: data.message || null
  };
}