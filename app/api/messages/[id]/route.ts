import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const messageId = params.id;

    await prisma.message.delete({
      where: { id: messageId },
    });

    return NextResponse.json({ message: "Message deleted" });
  } catch (error: any) {
    console.error("Delete error:", error);
    return NextResponse.json(
      { message: "Error deleting message" },
      { status: 500 }
    );
  }
}

// ✅ PUT handler for editing
export async function PUT(
  req: Request,
  context: { params: Record<string, string> }
) {
  const { params } = context;
  const id = params.id;
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded: any = jwt.verify(token, JWT_SECRET);

    if (decoded.role !== "ADMIN") {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { content, standard, section } = body;

    if (!content || !standard || !section) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const updatedMessage = await prisma.message.update({
      where: { id: params.id },
      data: {
        content,
        standard,
        section,
      },
    });

    return NextResponse.json({ message: "Message updated", updatedMessage });
  } catch (error: any) {
    console.error("Update error:", error);
    return NextResponse.json(
      { message: "Error updating message" },
      { status: 500 }
    );
  }
}
