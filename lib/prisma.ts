import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'
import { PrismaPg } from '@prisma/adapter-pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create database adapter for Prisma 7
const connectionString = process.env.DATABASE_URL

export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  adapter: connectionString ? new PrismaPg(new Pool({ connectionString })) : undefined,
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
