import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Get JWT secret from environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-default-secret-key-for-development";

// Create a custom interface for our User
interface XenoUser {
  id: string;
  email: string;
  name: string;
}

// Remove the global Express namespace extension - we'll use the one from types/express.d.ts

// Verify JWT token middleware
export const authenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Get token from Authorization header
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1]; // "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Authentication required",
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as XenoUser;

    // Add user data to request
    req.user = decoded;

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(401).json({
      status: "error",
      message: "Invalid token",
    });
  }
};

// For development/testing - mock auth middleware that doesn't verify tokens
export const mockAuthenticate = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Mock user data
  req.user = {
    id: "mock-user-id",
    email: "test@example.com",
    name: "Test User",
  };

  next();
};
