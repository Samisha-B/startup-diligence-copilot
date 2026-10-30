import type { Prisma } from "@prisma/client"
import { prisma } from "../prisma"
import { runDiligenceGraph } from "./graph"
import type { ApplicationInput } from "./schema"

export async function processApplication(id: string) {
  const app = await prisma.startupApplication.findUniqueOrThrow({ where: { id } })
  const input: ApplicationInput = {
    contactEmail: app.contactEmail,
    companyName: app.companyName,
    website: app.website ?? undefined,
    city: app.city,
    foundedYear: app.foundedYear,
    founders: app.founders,
    industries: app.industries,
    description: app.description,
    employeeBand: app.employeeBand as ApplicationInput["employeeBand"],
    fundingRaisedUsd: app.fundingRaisedUsd,
    fundingRounds: app.fundingRounds,
    investorCount: app.investorCount,
    annualRevenueUsd: app.annualRevenueUsd ?? undefined,
    customerCount: app.customerCount ?? undefined,
    monthlyGrowthPct: app.monthlyGrowthPct ?? undefined,
    otherClaims: app.otherClaims ?? undefined,
  }
  const result = await runDiligenceGraph(input)
  await prisma.$transaction([
    prisma.applicationQuestion.deleteMany({ where: { applicationId: id } }),
    prisma.applicationQuestion.createMany({
      data: result.questions.map((q) => ({ ...q, applicationId: id })),
    }),
    prisma.startupApplication.update({
      where: { id },
      data: {
        status: "verified",
        analysis: {
          findings: result.findings,
          stats: result.stats,
          usedFullSet: result.usedFullSet,
          matchedCompany: result.matchedCompany,
          examplePeers: result.examplePeers,
        } as unknown as Prisma.InputJsonValue,
      },
    }),
  ])
  return result
}
