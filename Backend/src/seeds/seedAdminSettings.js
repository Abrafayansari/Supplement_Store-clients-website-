import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../../generated/prisma/client.js";
import dotenv from "dotenv";

dotenv.config();

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({
  adapter,
});

async function seedAdminSettings() {
  try {
    console.log("🌱 Seeding AdminSettings with fake data...");

    // Check if settings already exist
    const existingSettings = await prisma.adminSettings.findFirst();

    if (existingSettings) {
      console.log("✅ Settings already exist, updating with new data...");
      await prisma.adminSettings.update({
        where: { id: existingSettings.id },
        data: {
          city: "Lahore",
          province: "Punjab",
          country: "Pakistan",
          address: "123 Gym Street, Sport Complex, Lahore, Punjab",
          email: "admin@nexus-gym.com",
          phone: "+92-300-1234567",
          whatsapp: "+92-300-1234567",
          headline: "Transform Your Body, Transform Your Life - NEXUS Fitness Hub",
          youtubeUrl: "https://www.youtube.com/nexus-gym",
          facebookUrl: "https://www.facebook.com/nexus.gym.official",
          instagramUrl: "https://www.instagram.com/nexus_gym_official/",
          linkedinUrl: "https://www.linkedin.com/company/nexus-gym/",
          bankName: "HBL (Habib Bank Limited)",
          accountTitle: "NEXUS Fitness Systems (Pvt) Ltd",
          bankAccountHolder: "Muhammad Ali Khan",
          iban: "PK36ABOC0000001212121212",
          deliveryCharges: JSON.stringify([
            { province: "Punjab", charge: 500 },
            { province: "Sindh", charge: 600 },
            { province: "KPK", charge: 700 },
            { province: "Balochistan", charge: 800 },
            { province: "Gilgit-Baltistan", charge: 1000 },
            { province: "Azad Kashmir", charge: 750 }
          ]),
        },
      });
      console.log("✅ Settings updated successfully!");
    } else {
      console.log("📝 Creating new settings...");
      const newSettings = await prisma.adminSettings.create({
        data: {
          city: "Lahore",
          province: "Punjab",
          country: "Pakistan",
          address: "123 Gym Street, Sport Complex, Lahore, Punjab",
          email: "admin@nexus-gym.com",
          phone: "+92-300-1234567",
          whatsapp: "+92-300-1234567",
          headline: "Transform Your Body, Transform Your Life - NEXUS Fitness Hub",
          youtubeUrl: "https://www.youtube.com/nexus-gym",
          facebookUrl: "https://www.facebook.com/nexus.gym.official",
          instagramUrl: "https://www.instagram.com/nexus_gym_official/",
          linkedinUrl: "https://www.linkedin.com/company/nexus-gym/",
          bankName: "HBL (Habib Bank Limited)",
          accountTitle: "NEXUS Fitness Systems (Pvt) Ltd",
          bankAccountHolder: "Muhammad Ali Khan",
          iban: "PK36ABOC0000001212121212",
          deliveryCharges: JSON.stringify([
            { province: "Punjab", charge: 500 },
            { province: "Sindh", charge: 600 },
            { province: "KPK", charge: 700 },
            { province: "Balochistan", charge: 800 },
            { province: "Gilgit-Baltistan", charge: 1000 },
            { province: "Azad Kashmir", charge: 750 }
          ]),
        },
      });
      console.log("✅ Settings created successfully!");
      console.log(newSettings);
    }

    await prisma.$disconnect();
  } catch (error) {
    console.error("❌ Error seeding data:", error);
    await prisma.$disconnect();
    process.exit(1);
  }
}

seedAdminSettings();
