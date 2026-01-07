import jwt from "jsonwebtoken";
import dotenv from "dotenv"

dotenv.config()
export const authenticate = (req, res, next) => {
  const token = req.cookies?.access_token;

  if (!token) {
    return res.status(401).json({ error: "Not authenticated" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: decoded.userId, email: decoded.email, role: decoded.role };
        next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
