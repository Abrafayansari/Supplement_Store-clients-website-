import { PrismaPg } from"@prisma/adapter-pg";
import { PrismaClient } from"../../generated/prisma/client.js";
import dotenv from "dotenv";
dotenv.config();
const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

export const connectdb = async () => {
  try {
    await prisma.$connect();
    console.log("DB connected via Prisma!");
  } catch (err) {
    console.error("DB connection failed:", err);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  await prisma.$disconnect();
};
export {prisma}