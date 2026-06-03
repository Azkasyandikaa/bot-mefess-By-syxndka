import fs from 'fs';
import path from 'path';

export function saveMediaBuffer(buffer, filename) {
  const filePath = path.resolve('src/storage/uploads', filename);
  fs.writeFileSync(filePath, buffer);
  return filePath;
}