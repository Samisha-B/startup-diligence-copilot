import { z } from "zod"

export const EMPLOYEE_BANDS = ["1-10", "11-50", "51-100", "101-250", "251-500", "501-1000", "1001-5000", "5001-10000", "10001+"] as const

export const applicationSchema = z.object({
  contactEmail: z.string().email(),
  companyName: z.string().min(1).max(200),
  website: z.string().max(300).optional().or(z.literal("")),
  city: z.string().min(1).max(100),
  foundedYear: z.coerce.number().int().min(1950).max(new Date().getFullYear() + 1),
  founders: z.string().min(1).max(500),
  industries: z
    .string()
    .min(1)
    .transform((s) => s.split(",").map((x) => x.trim()).filter(Boolean)),
  description: z.string().min(10).max(3000),
  employeeBand: z.enum(EMPLOYEE_BANDS),
  fundingRaisedUsd: z.coerce.number().min(0),
  fundingRounds: z.coerce.number().int().min(0).max(50),
  investorCount: z.coerce.number().int().min(0).max(500),
  annualRevenueUsd: z.coerce.number().min(0).optional(),
  customerCount: z.coerce.number().int().min(0).optional(),
  monthlyGrowthPct: z.coerce.number().min(-100).max(1000).optional(),
  otherClaims: z.string().max(3000).optional(),
})

export type ApplicationInput = z.output<typeof applicationSchema>
