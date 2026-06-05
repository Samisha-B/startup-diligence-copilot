// This file is the single source of truth for what's allowed in each mode.
// PRODUCT_MODE env var is "free" or "full". Default to "free" if not set.

export type ProductMode = "free" | "full";

export const PRODUCT_MODE: ProductMode =
  (process.env.PRODUCT_MODE as ProductMode) ?? "free";

export const isFree = PRODUCT_MODE === "free";
export const isFull = PRODUCT_MODE === "full";

export const limits = {
  maxDealsPerUser: isFree ? 3 : 999,
  maxDocsPerDeal: isFree ? 3 : 50,
  maxFileSizeMB: isFree ? 5 : 50,
  maxWebPages: isFree ? 5 : 20,
  maxChatTurnsPerDay: isFree ? 30 : 500,
  supportedFileTypes: isFree
    ? ["pdf", "docx", "txt"]
    : ["pdf", "docx", "txt", "pptx", "xlsx", "csv"],
  useInlineIngestion: isFree,   // In free mode, process inside API route (no worker)
  useAsyncIngestion: isFull,    // In full mode, push job to queue/worker
  useObjectStorage: isFull,     // In free mode, we DON'T store the original file binary
} as const;