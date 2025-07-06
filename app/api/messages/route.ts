// app/api/message/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const messages = await prisma.message.findMany({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(messages);
  } catch (err) {
    console.error("Fetch error:", err);
    return NextResponse.json({ message: "Failed to fetch messages" }, { status: 500 });
  }
}
