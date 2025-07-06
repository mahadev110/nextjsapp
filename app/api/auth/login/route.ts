import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "mysecret";

export async function POST(req: Request) {
  try {
    const { mobile, password } = await req.json();
    console.log("Login attempt:", mobile);

    if (!mobile || !password) {
      return NextResponse.json({ message: "Mobile and password required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { mobile },
    });

    if (!user || user.password !== password) {
      return NextResponse.json({ message: "Invalid mobile or password" }, { status: 401 });
    }

    const token = jwt.sign(
      {
        userId: user.id,
        role: user.role,
        standard: user.standard,
        section: user.section,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    return NextResponse.json({ token, role: user.role });
  } catch (error: any) {
    console.error("Login error:", error.message || error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
