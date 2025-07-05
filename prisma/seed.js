import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log("🧹 Clearing existing data...");
  await prisma.message.deleteMany();
  await prisma.user.deleteMany();

  console.log("👤 Creating admin...");
  await prisma.user.create({
    data: {
 mobile: "9999999999",
    password: "admin",
    role: "ADMIN",
    standard: "N/A", // or "admin"
    section: "N/A",  // or "admin"
    },
  });

  console.log("👥 Creating students...");
  await prisma.user.createMany({
    data: [
      {
        mobile: "9000000001",
        password: "1234",
        standard: "8",
        section: "A",
        role: "STUDENT",
      },
      {
        mobile: "9000000002",
        password: "1234",
        standard: "8",
        section: "B",
        role: "STUDENT",
      },
      {
        mobile: "9000000003",
        password: "1234",
        standard: "9",
        section: "A",
        role: "STUDENT",
      },
    ],
  });

  console.log("✅ Seeding complete!");
}

main().finally(() => prisma.$disconnect());
