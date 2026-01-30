import { prisma } from "./src/config/db.js";

async function test() {
    try {
        await prisma.$connect();
        console.log("CONNECTED");
        const banners = await prisma.banner.findMany();
        console.log("BANNERS_COUNT:", banners.length);
    } catch (err) {
        console.log("ERROR_MESSAGE:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
