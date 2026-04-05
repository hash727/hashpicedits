import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

// Force load .env for Windows environments
dotenv.config();

const prismaClientSingleton = () => {
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is missing in your .env file.");
  }

  //   Setup the connection pool
  const pool = new Pool({ connectionString: process.env.DATABASE_URL });

  //   Setup the adapter
  const adapter = new PrismaPg(pool as any);

  return new PrismaClient({
    adapter,
    log: ["error", "warn"],
  });
};

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? prismaClientSingleton();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
