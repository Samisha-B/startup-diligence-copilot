import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { limits } from "@/lib/config/product-mode";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userId = session.user.id;

  let membership = await prisma.membership.findFirst({
    where: { userId },
    include: { organization: true },
  });

  if (!membership) {
    const org = await prisma.organization.create({
      data: {
        name: `${session.user.name ?? session.user.email ?? "User"}'s workspace`,
      },
    });

    membership = await prisma.membership.create({
      data: {
        userId,
        organizationId: org.id,
        role: "owner",
      },
      include: { organization: true },
    });
  }

  const orgId = membership.organizationId;

  const existingDeals = await prisma.deal.count({
    where: { organizationId: orgId },
  });

  if (existingDeals >= limits.maxDealsPerUser) {
    return NextResponse.json(
      { error: `Free plan allows max ${limits.maxDealsPerUser} deals.` },
      { status: 403 }
    );
  }

  const body = await req.json();
  const { name, startupName, website, notes, linkedinUrl } = body;

  if (!name || !startupName) {
    return NextResponse.json(
      { error: "name and startupName are required" },
      { status: 400 }
    );
  }

  const deal = await prisma.deal.create({
    data: {
      organizationId: orgId,
      name,
      startupName,
      website,
      linkedinUrl,
      notes,
    },
  });

  return NextResponse.json(deal, { status: 201 });
}

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const membership = await prisma.membership.findFirst({
    where: { userId: session.user.id },
  });

  if (!membership) {
    return NextResponse.json({ deals: [] });
  }

  const deals = await prisma.deal.findMany({
    where: { organizationId: membership.organizationId },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      startupName: true,
      website: true,
      stage: true,
      createdAt: true,
      _count: {
        select: {
          documents: true,
        },
      },
    },
  });

  return NextResponse.json({ deals });
}