import prisma from "@/lib/prisma";
import jwt from "jsonwebtoken";

export default async function handler(req, res) {
  const token = req.headers.authorization?.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  if (decoded.role !== "STUDENT") {
    return res.status(403).json({ message: "Unauthorized" });
  }

  const messages = await prisma.message.findMany({
    where: { receiverId: decoded.id },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json(messages);
}
