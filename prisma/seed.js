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
      username: "admin",
      password: "admin",
      role: "ADMIN",
      standard: "N/A",
      section: "N/A",
    },
  });

  console.log("👥 Creating students...");
  await prisma.user.createMany({
    data: [
      {
        mobile: "9000000001",
        username: "student1",
        password: "1234",
        standard: "8",
        section: "A",
        role: "STUDENT",
      },
      {
        mobile: "9000000002",
        username: "student2",
        password: "1234",
        standard: "8",
        section: "B",
        role: "STUDENT",
      },
      {
        mobile: "9000000003",
        username: "student3",
        password: "1234",
        standard: "9",
        section: "A",
        role: "STUDENT",
      },
    ],
  
  });

  console.log("✅ Seeding complete!");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
