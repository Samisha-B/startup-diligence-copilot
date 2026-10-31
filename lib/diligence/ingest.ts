import type { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { extractText } from "./ocr"
import { extractFacts } from "./facts"

export async function ingestApplicationDocument(args: { applicationId: string; name: string; mime: string; buffer: Buffer }) {
  const doc = await prisma.applicationDocument.create({
    data: { applicationId: args.applicationId, name: args.name, mimeType: args.mime, sizeBytes: args.buffer.length, status: "processing" },
  })
  try {
    const { text, method } = await extractText(args.buffer, args.mime, args.name)
    if (!text.trim()) throw new Error("No text could be extracted from the file.")
    const facts = await extractFacts(text)
    return await prisma.applicationDocument.update({
      where: { id: doc.id },
      data: { status: "done", method, extractedText: text.slice(0, 100000), facts: facts as unknown as Prisma.InputJsonValue },
    })
  } catch (e) {
    return await prisma.applicationDocument.update({
      where: { id: doc.id },
      data: { status: "failed", error: (e as Error).message },
    })
  }
}
