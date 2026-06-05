import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function searchEvidence({
  dealId,
  query,
  topK = 6,
}: {
  dealId: string;
  query: string;
  topK?: number;
}) {
  // 1. Embed the query
  const res = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const queryVector = res.data[0].embedding;

  // 2. Fetch all chunks for this deal (free mode: small enough to do in-memory)
  const chunks = await prisma.documentChunk.findMany({
    where: { dealId, embedding: { not: null } },
    select: { id: true, text: true, documentId: true, embedding: true, pageNumber: true, sectionLabel: true },
  });

  if (chunks.length === 0) return [];

  // 3. Cosine similarity in JS (works fine for small datasets in free mode)
  const scored = chunks.map((chunk) => {
    const storedFloats = new Float32Array(chunk.embedding!.buffer);
    const score = cosineSimilarity(queryVector, Array.from(storedFloats));
    return { ...chunk, score };
  });

  // 4. Return top-K sorted by score
  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
}

function cosineSimilarity(a: number[], b: number[]): number {
  let dot = 0, normA = 0, normB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    normA += a[i] * a[i];
    normB += b[i] * b[i];
  }
  return dot / (Math.sqrt(normA) * Math.sqrt(normB));
}