import OpenAI from "openai"

const MODEL = process.env.OCR_MODEL ?? "gpt-4o-mini"
let client: OpenAI | null = null
const openai = () => (client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }))

export const IMAGE_MIMES = ["image/png", "image/jpeg", "image/webp"]
export const DOCX_MIME = "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
export const ACCEPTED_MIMES = ["application/pdf", "text/plain", DOCX_MIME, ...IMAGE_MIMES]

const OCR_PROMPT =
  "Transcribe all text in this document exactly as written. Preserve numbers, currency symbols, dates, names and table rows (use ' | ' between columns). Output only the transcription."

async function ocrWithVision(buffer: Buffer, mime: string, name: string): Promise<string> {
  if (!process.env.OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not set; OCR needs it.")
  const url = `data:${mime};base64,${buffer.toString("base64")}`
  const part =
    mime === "application/pdf"
      ? ({ type: "file", file: { filename: name, file_data: url } } as const)
      : ({ type: "image_url", image_url: { url } } as const)
  const res = await openai().chat.completions.create({
    model: MODEL,
    messages: [{ role: "user", content: [{ type: "text", text: OCR_PROMPT }, part] }],
    max_completion_tokens: 4000,
  })
  return res.choices[0]?.message?.content ?? ""
}

async function pdfText(buffer: Buffer): Promise<string> {
  const { PDFParse } = await import("pdf-parse")
  const parser = new PDFParse({ data: new Uint8Array(buffer) })
  try {
    return (await parser.getText()).text
  } finally {
    await parser.destroy()
  }
}

export type Extracted = { text: string; method: "text" | "pdf-text" | "ocr-vision" }

export async function extractText(buffer: Buffer, mime: string, name: string): Promise<Extracted> {
  if (mime === "text/plain") return { text: buffer.toString("utf-8"), method: "text" }
  if (mime === DOCX_MIME) {
    const mammoth = (await import("mammoth")).default
    return { text: (await mammoth.extractRawText({ buffer })).value, method: "text" }
  }
  if (mime === "application/pdf") {
    try {
      const t = await pdfText(buffer)
      if (t.trim().length >= 200) return { text: t, method: "pdf-text" }
    } catch {
      // fall through to OCR
    }
    return { text: await ocrWithVision(buffer, mime, name), method: "ocr-vision" }
  }
  if (IMAGE_MIMES.includes(mime)) {
    return { text: await ocrWithVision(buffer, mime, name), method: "ocr-vision" }
  }
  throw new Error(`Unsupported file type: ${mime}`)
}
