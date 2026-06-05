import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import OpenAI from "openai";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { searchEvidence } from "@/lib/retrieval/search-evidence";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

type EvidenceChunk = {
  id: string;
  text: string;
  documentId: string;
  pageNumber?: number | null;
  sectionLabel?: string | null;
  score: number;
};

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: dealId } = await context.params;
  const { question, sessionId } = await req.json();

  if (!question || typeof question !== "string") {
    return NextResponse.json(
      { error: "question is required" },
      { status: 400 }
    );
  }

  const deal = await prisma.deal.findFirst({
    where: {
      id: dealId,
      organization: {
        memberships: {
          some: {
            userId: session.user.id,
          },
        },
      },
    },
  });

  if (!deal) {
    return NextResponse.json({ error: "Deal not found" }, { status: 404 });
  }

  let qaSession = null;

  if (sessionId) {
    qaSession = await prisma.qASession.findFirst({
      where: {
        id: sessionId,
        dealId,
      },
    });
  }

  if (!qaSession) {
    qaSession = await prisma.qASession.create({
      data: {
        dealId,
        title: question.slice(0, 60),
      },
    });
  }

  await prisma.message.create({
    data: {
      sessionId: qaSession.id,
      role: "user",
      content: question,
    },
  });

  const evidenceChunks: EvidenceChunk[] = await searchEvidence({
    dealId,
    query: question,
    topK: 6,
  });

  const evidenceText = evidenceChunks
    .map((chunk, index) => `[SOURCE ${index + 1}] ${chunk.text}`)
    .join("\n\n---\n\n");

  const systemPrompt = `You are a diligence assistant helping an investor analyze a startup.
Answer ONLY from the provided evidence.
If evidence is weak or missing, say that clearly.
Cite sources like [SOURCE 1].`;

  const userPrompt = `Evidence:\n${evidenceText}\n\nQuestion: ${question}`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    temperature: 0.1,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  const answer = completion.choices[0]?.message?.content ?? "Unable to generate answer.";

  const assistantMessage = await prisma.message.create({
    data: {
      sessionId: qaSession.id,
      role: "assistant",
      content: answer,
    },
  });

  if (evidenceChunks.length > 0) {
    await prisma.citation.createMany({
      data: evidenceChunks.slice(0, 3).map((chunk) => ({
        sourceId: chunk.id,
        sourceKind: "document_chunk",
        documentChunkId: chunk.id,
        documentId: chunk.documentId,
        excerpt: chunk.text.slice(0, 200),
        messageId: assistantMessage.id,
        pageNumber: chunk.pageNumber ?? null,
        sectionLabel: chunk.sectionLabel ?? null,
      })),
    });
  }

  return NextResponse.json({
    answer,
    sessionId: qaSession.id,
    sources: evidenceChunks.slice(0, 3).map((chunk) => ({
      id: chunk.id,
      excerpt: chunk.text.slice(0, 200),
      documentId: chunk.documentId,
      pageNumber: chunk.pageNumber ?? null,
      sectionLabel: chunk.sectionLabel ?? null,
    })),
  });
}