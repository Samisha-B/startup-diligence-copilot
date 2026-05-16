import { NextResponse } from "next/server";
import { dealsStore } from "@/lib/deals-store";

export async function GET() {
  return NextResponse.json({
    ok: true,
    deals: dealsStore,
  });
}

export async function POST(request: Request) {
  const body = await request.json();

  const newDeal = {
    id: crypto.randomUUID(),
    startupName: body.startupName,
    website: body.website,
    stage: body.stage,
    sector: body.sector,
    createdAt: new Date().toISOString(),
  };

  dealsStore.unshift(newDeal);

  console.log("Received deal:", newDeal);

  return NextResponse.json({
    ok: true,
    message: "Deal received successfully",
    deal: newDeal,
  });
}