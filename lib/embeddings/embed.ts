import { prisma } from "@/lib/prisma";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function embedChunks({
  docId,
  chunks,
}: {
  docId: string;
  chunks: string[];
}) {
  // Get the dealId from the document
  const doc = await prisma.document.findUniqueOrThrow({ where: { id: docId } });

  for (let i = 0; i < chunks.length; i++) {
    const text = chunks[i];

    // Call OpenAI embedding API
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });

    const embeddingVector = response.data[0].embedding; // float[]
    // Store as raw bytes (Buffer from float32 array)
    const floatArray = new Float32Array(embeddingVector);
    const embeddingBytes = Buffer.from(floatArray.buffer);

    await prisma.documentChunk.create({
      data: {
        documentId: docId,
        dealId: doc.dealId,
        text,
        chunkIndex: i,
        embedding: embeddingBytes,
      },
    });
  }
}