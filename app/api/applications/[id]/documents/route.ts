import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { limits } from "@/lib/config/product-mode"
import { ACCEPTED_MIMES } from "@/lib/diligence/ocr"
import { ingestApplicationDocument } from "@/lib/diligence/ingest"
import { processApplication } from "@/lib/diligence/service"

export const runtime = "nodejs"
export const maxDuration = 60

const MAX_DOCS = 5

export async function POST(req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  const app = await prisma.startupApplication.findUnique({ where: { id }, select: { id: true } })
  if (!app) return NextResponse.json({ error: "Application not found" }, { status: 404 })

  const form = await req.formData()
  const file = form.get("file")
  if (!(file instanceof File)) return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
  if (!ACCEPTED_MIMES.includes(file.type)) {
    return NextResponse.json({ error: "Unsupported type. Use PDF, DOCX, TXT, PNG, JPG or WEBP." }, { status: 400 })
  }
  if (file.size > limits.maxFileSizeMB * 1024 * 1024) {
    return NextResponse.json({ error: `File too large (max ${limits.maxFileSizeMB} MB).` }, { status: 400 })
  }
  const count = await prisma.applicationDocument.count({ where: { applicationId: id } })
  if (count >= MAX_DOCS) return NextResponse.json({ error: `Max ${MAX_DOCS} documents per application.` }, { status: 400 })

  const doc = await ingestApplicationDocument({
    applicationId: id,
    name: file.name,
    mime: file.type,
    buffer: Buffer.from(await file.arrayBuffer()),
  })
  if (doc.status === "done") await processApplication(id)
  return NextResponse.json({ id: doc.id, status: doc.status, method: doc.method, error: doc.error })
}
