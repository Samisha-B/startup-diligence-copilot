import { NextResponse } from "next/server"
import { processApplication } from "@/lib/diligence/service"

export async function POST(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params
  try {
    await processApplication(id)
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 })
  }
}
