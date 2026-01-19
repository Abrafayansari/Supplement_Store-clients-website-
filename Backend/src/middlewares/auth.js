//  import jwt from "jsonwebtoken";
//  import dotenv from "dotenv"

// dotenv.config()
//  export const authenticate = (req, res, next) => {
// //   const token = req.cookies?.access_token;

// //   if (!token) {
// //     return res.status(401).json({ error: "Not authenticated" });
// //   }

// //   try {
// //     const decoded = jwt.verify(token, process.env.JWT_SECRET);
// //     req.user = { userId: decoded.userId, email: decoded.email, role: decoded.role };
// //         next();
// //   } catch {
// //     return res.status(401).json({ error: "Invalid or expired token" });
// //   }
// const authHeader = req.headers.authorization;
// if (!authHeader) return res.status(401).json({ error: "No token" });
// const token = authHeader.split(" ")[1];
// const user = jwt.verify(token, process.env.JWT_SECRET);
// req.user = user;
// next();
//  };


import jwt from "jsonwebtoken";

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded; // { userId, email, role }

    next();
  } catch (error) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};
