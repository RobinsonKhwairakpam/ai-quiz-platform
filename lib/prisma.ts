// lib/prisma.ts
import { PrismaClient } from "@prisma/client";

const globalForPrisma = global as unknown as { db: PrismaClient };

const db =
  globalForPrisma.db || new PrismaClient();

export default db

if (process.env.NODE_ENV !== "production") globalForPrisma.db = db;