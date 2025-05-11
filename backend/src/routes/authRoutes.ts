import express from "express";
import passport from "passport";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { mockAuthenticate } from "../middleware/auth";

dotenv.config();

const router = express.Router();

// Environment variables
const JWT_SECRET =
  process.env.JWT_SECRET || "your-default-secret-key-for-development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
const TOKEN_EXPIRY = process.env.TOKEN_EXPIRY || "7d"; // Default token expiry: 7 days

/**
 * @swagger
 * /api/auth/google:
 *   get:
 *     summary: Initiate Google OAuth login
 *     description: Redirects to Google for authentication
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to Google
 */
router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
  })
);

/**
 * @swagger
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     description: Handles the Google OAuth callback and issues JWT
 *     tags: [Authentication]
 *     responses:
 *       302:
 *         description: Redirects to frontend with token
 */
router.get(
  "/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {
    try {
      // Extract user info
      const user = req.user as {
        id: string;
        email: string;
        name: string;
        picture?: string;
      };

      // Create payload for JWT
      const payload = {
        id: user.id,
        email: user.email,
        name: user.name,
      };

      // Create JWT token - use proper typing with Buffer
      // @ts-ignore - Ignore TypeScript errors for jwt.sign
      const token = jwt.sign(payload, JWT_SECRET, {
        expiresIn: TOKEN_EXPIRY,
      });

      // Redirect to frontend with token (in production, use secure cookies)
      res.redirect(`${FRONTEND_URL}/auth-callback?token=${token}`);
    } catch (error) {
      console.error("Error in Google callback:", error);
      res.redirect(`${FRONTEND_URL}/auth-callback?error=Authentication failed`);
    }
  }
);

/**
 * @swagger
 * /api/auth/validate:
 *   get:
 *     summary: Validate token
 *     description: Validates the JWT token and returns user data
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token is valid, returns user data
 *       401:
 *         description: Unauthorized - invalid token
 */
router.get(
  "/validate",
  process.env.NODE_ENV === "production"
    ? passport.authenticate("jwt", { session: false })
    : mockAuthenticate,
  (req, res) => {
    // If we reach here, the token is valid
    res.json({
      status: "success",
      data: req.user,
    });
  }
);

export default router;
