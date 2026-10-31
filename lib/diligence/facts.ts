import OpenAI from "openai"
import { z } from "zod"

const MODEL = process.env.FACTS_MODEL ?? process.env.OCR_MODEL ?? "gpt-4o-mini"
let client: OpenAI | null = null
const openai = () => (client ??= new OpenAI({ apiKey: process.env.OPENAI_API_KEY }))

const num = z.number().nullable().optional()
const str = z.string().nullable().optional()

export const factsSchema = z.object({
  docType: z.string().default("other"),
  companyName: str,
  revenueAmount: num,
  revenueCurrency: str,
  revenuePeriod: str,
  customerCount: num,
  incorporationYear: num,
  totalFundingAmount: num,
  fundingCurrency: str,
  founders: z.array(z.string()).nullable().optional(),
  keyEvidence: str,
})

export type DocFacts = z.infer<typeof factsSchema>

const PROMPT = `You extract verifiable startup facts from a document's text. Reply with a single JSON object with exactly these keys (use null when the document does not state it; never guess):
- docType: one of bank_statement, gst_return, invoice, financial_statement, incorporation, cap_table, pitch_deck, term_sheet, other
- companyName: legal/business name the document belongs to
- revenueAmount: total revenue/turnover/sales as a plain number (no commas)
- revenueCurrency: ISO code such as INR or USD
- revenuePeriod: annual, quarterly, monthly or unknown (the period revenueAmount covers)
- customerCount: number of customers/users if stated
- incorporationYear: year of incorporation if stated
- totalFundingAmount: total funding raised as a plain number
- fundingCurrency: ISO code
- founders: array of founder/director names
- keyEvidence: one short sentence quoting where the main figure came from
Convert Indian units to full numbers (1 lakh = 100000, 1 crore = 10000000).`

export async function extractFacts(text: string): Promise<DocFacts> {
  const res = await openai().chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      { role: "system", content: PROMPT },
      { role: "user", content: text.slice(0, 30000) },
    ],
  })
  try {
    const parsed = factsSchema.safeParse(JSON.parse(res.choices[0]?.message?.content ?? "{}"))
    return parsed.success ? parsed.data : { docType: "other" }
  } catch {
    return { docType: "other" }
  }
}
