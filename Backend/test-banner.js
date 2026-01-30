import { prisma } from "./src/config/db.js";

async function test() {
    try {
        console.log("Attempting to connect...");
        await prisma.$connect();
        console.log("Connected! Attempting to find banners...");
        const banners = await prisma.banner.findMany();
        console.log("Banners found:", banners);
    } catch (err) {
        console.error("Test failed:", err);
    } finally {
        await prisma.$disconnect();
    }
}

test();
