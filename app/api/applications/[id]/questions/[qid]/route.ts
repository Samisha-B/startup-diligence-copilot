import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function PATCH(req: Request, ctx: { params: Promise<{ id: string; qid: string }> }) {
  const { id, qid } = await ctx.params
  const body = (await req.json()) as { asked?: boolean; answer?: string }
  const q = await prisma.applicationQuestion.updateMany({
    where: { id: qid, applicationId: id },
    data: {
      ...(typeof body.asked === "boolean" ? { asked: body.asked } : {}),
      ...(typeof body.answer === "string" ? { answer: body.answer } : {}),
    },
  })
  return NextResponse.json({ updated: q.count })
}
