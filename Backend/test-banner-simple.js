import { prisma } from "./src/config/db.js";

async function test() {
    try {
        await prisma.$connect();
        await prisma.banner.findMany();
    } catch (err) {
        console.log("ERROR_MESSAGE:", err.message);
    } finally {
        await prisma.$disconnect();
    }
}

test();
