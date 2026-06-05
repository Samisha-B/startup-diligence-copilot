// Splits long text into overlapping chunks for better retrieval
export function chunkText(text: string, chunkSize = 800, overlap = 150): string[] {
  const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 30);
  const chunks: string[] = [];
  let current = "";

  for (const para of paragraphs) {
    if ((current + "\n\n" + para).length > chunkSize) {
      if (current) chunks.push(current.trim());
      // Overlap: carry last N chars of previous chunk into next
      current = current.slice(-overlap) + "\n\n" + para;
    } else {
      current = current ? current + "\n\n" + para : para;
    }
  }

  if (current.trim()) chunks.push(current.trim());
  return chunks;
}