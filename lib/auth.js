import jwt from "jsonwebtoken";

export const verifyToken = (req) => {
  const token = req.headers.authorization?.split(" ")[1];
  return jwt.verify(token, process.env.JWT_SECRET);
};
