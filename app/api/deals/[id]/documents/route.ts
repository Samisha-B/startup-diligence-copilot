import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { limits } from "@/lib/config/product-mode";
import { ingestDocument } from "@/lib/documents/process-document";

export async function POST(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: dealId } = await context.params;

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

  const docCount = await prisma.document.count({
    where: { dealId },
  });

  if (docCount >= limits.maxDocsPerDeal) {
    return NextResponse.json(
      { error: `Free plan allows max ${limits.maxDocsPerDeal} documents per deal.` },
      { status: 403 }
    );
  }

  const formData = await req.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "No file provided" }, { status: 400 });
  }

  const maxBytes = limits.maxFileSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return NextResponse.json(
      { error: `File too large. Max ${limits.maxFileSizeMB}MB.` },
      { status: 400 }
    );
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "other";

  if (!limits.supportedFileTypes.includes(ext as any)) {
    return NextResponse.json(
      { error: `Unsupported file type: .${ext}` },
      { status: 400 }
    );
  }

  const doc = await prisma.document.create({
    data: {
      dealId,
      fileName: file.name,
      type: ext as any,
      status: "uploaded",
      sizeBytes: file.size,
    },
  });

  const job = await prisma.job.create({
    data: {
      dealId,
      documentId: doc.id,
      type: "document_ingest",
      status: "queued",
    },
  });

  if (limits.useInlineIngestion) {
    const buffer = Buffer.from(await file.arrayBuffer());

    ingestDocument({
      docId: doc.id,
      jobId: job.id,
      buffer,
      ext,
    }).catch(console.error);
  }

  return NextResponse.json({ document: doc, job }, { status: 201 });
}