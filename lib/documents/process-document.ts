import { prisma } from "@/lib/prisma";
import { chunkText } from "./chunker";
import { embedChunks } from "../embeddings/embed";

interface IngestArgs {
  docId: string;
  jobId: string;
  buffer: Buffer;
  ext: string;
}

export async function ingestDocument({ docId, jobId, buffer, ext }: IngestArgs) {
  // Mark job + doc as running
  await prisma.job.update({ where: { id: jobId }, data: { status: "running", startedAt: new Date(), attempts: { increment: 1 } } });
  await prisma.document.update({ where: { id: docId }, data: { status: "extracting" } });

  try {
    let rawText = "";

    if (ext === "pdf") {
      rawText = await extractPdf(buffer);
    } else if (ext === "docx") {
      rawText = await extractDocx(buffer);
    } else if (ext === "txt") {
      rawText = buffer.toString("utf-8");
    }

    if (!rawText.trim()) throw new Error("No text could be extracted from file.");

    // Chunk the text
    const chunks = chunkText(rawText);

    await prisma.document.update({ where: { id: docId }, data: { status: "chunked" } });

    // Save chunks + embed them
    await embedChunks({ docId, chunks });

    // Done
    await prisma.document.update({ where: { id: docId }, data: { status: "embedded", extractedAt: new Date() } });
    await prisma.job.update({ where: { id: jobId }, data: { status: "completed", completedAt: new Date() } });
  } catch (err: any) {
    await prisma.document.update({ where: { id: docId }, data: { status: "failed", error: err.message } });
    await prisma.job.update({ where: { id: jobId }, data: { status: "failed", error: err.message } });
  }
}

// ── PDF extraction using pdf-parse ──
async function extractPdf(buffer: Buffer): Promise<string> {
  const pdfParse = (await import("pdf-parse")).default;
  const result = await pdfParse(buffer);
  return result.text;
}

// ── DOCX extraction using mammoth ──
async function extractDocx(buffer: Buffer): Promise<string> {
  const mammoth = (await import("mammoth")).default;
  const result = await mammoth.extractRawText({ buffer });
  return result.value;
}