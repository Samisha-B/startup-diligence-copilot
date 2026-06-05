// prisma/prisma.config.ts
import "dotenv/config"                    // ← loads .env before anything else
import { defineConfig } from 'prisma/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { Pool } from 'pg'

export default defineConfig({
  earlyAccess: true,
  schema: 'prisma/schema.prisma',
  migrate: {
    async adapter() {
      // For migrations, use the DIRECT_URL (bypasses Neon's connection pooler)
      const pool = new Pool({
        connectionString: process.env.DIRECT_URL,
        ssl: { rejectUnauthorized: false },
      })
      return new PrismaPg(pool)
    },
  },
})