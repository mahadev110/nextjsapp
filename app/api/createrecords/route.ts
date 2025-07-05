import { NextResponse } from "next/server";
import { PrismaClient } from "@/app/generated/prisma";

const prisma = new PrismaClient();

export async function GET() {
  const records = await prisma.testtbl.findMany();
  return NextResponse.json(records);
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, content } = body;

    const newRecord = await prisma.testtbl.create({
      data: { title, content },
    });

    return NextResponse.json(newRecord, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to create record" }, { status: 500 });
  }
}
