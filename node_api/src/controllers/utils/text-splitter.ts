export function splitWithOverlap(
  text: string,
  chunkSize: number,
  overlap: number
) {
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += chunkSize - overlap) {
    const chunk = text.substring(i, Math.min(i + chunkSize, text.length));
    chunks.push(chunk);
  }
  return chunks;
}
