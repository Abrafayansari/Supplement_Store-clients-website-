import { prisma } from "./src/config/db.js";

async function run() {
    try {
        await prisma.$connect();
        console.log("Connected to DB");
        await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Banner" (
          "id" TEXT NOT NULL,
          "image" TEXT NOT NULL,
          "title" TEXT,
          "link" TEXT,
          "isActive" BOOLEAN NOT NULL DEFAULT true,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,

          CONSTRAINT "Banner_pkey" PRIMARY KEY ("id")
      );
    `);
        console.log("Table created or already exists.");
    } catch (err) {
        console.error("Failed to run SQL:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

run();
