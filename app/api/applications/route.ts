import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { applicationSchema } from "@/lib/diligence/schema"
import { processApplication } from "@/lib/diligence/service"

// Public endpoint for founders to submit. Add rate limiting/captcha before production.
export async function POST(req: Request) {
  const parsed = applicationSchema.safeParse(await req.json().catch(() => null))
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  }
  const d = parsed.data
  const created = await prisma.startupApplication.create({
    data: { ...d, website: d.website || null },
  })
  try {
    await processApplication(created.id)
  } catch (e) {
    await prisma.startupApplication.update({ where: { id: created.id }, data: { status: "error" } })
    console.error("diligence graph failed", e)
  }
  return NextResponse.json({ id: created.id }, { status: 201 })
}
