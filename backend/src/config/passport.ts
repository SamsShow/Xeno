import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import dotenv from "dotenv";
import { User } from "../models";

dotenv.config();

// Environment variables
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || "";
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || "";
const JWT_SECRET =
  process.env.JWT_SECRET || "your-default-secret-key-for-development";
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

// JWT options
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: JWT_SECRET,
};

// Initialize passport strategies
export const initializePassport = () => {
  // Google OAuth Strategy
  passport.use(
    new GoogleStrategy(
      {
        clientID: GOOGLE_CLIENT_ID,
        clientSecret: GOOGLE_CLIENT_SECRET,
        callbackURL: "/api/auth/google/callback",
        scope: ["profile", "email"],
      },
      async (accessToken, refreshToken, profile, done) => {
        try {
          // Check if user already exists
          let user = await User.findOne({ where: { googleId: profile.id } });

          if (!user) {
            // Create new user if it doesn't exist
            user = await User.create({
              googleId: profile.id,
              email: profile.emails?.[0]?.value || "",
              name: profile.displayName,
              picture: profile.photos?.[0]?.value,
              role: "user", // Default role
            });
          } else {
            // Update user's last login
            await user.update({ lastLogin: new Date() });
          }

          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
            picture: user.picture,
            role: user.role,
          });
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // JWT Strategy for API authentication
  passport.use(
    new JwtStrategy(
      {
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
        secretOrKey: JWT_SECRET,
      },
      async (payload, done) => {
        try {
          const user = await User.findByPk(payload.id);

          if (!user) {
            return done(null, false);
          }

          if (!user.active) {
            return done(null, false);
          }

          return done(null, {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
          });
        } catch (error) {
          return done(error as Error);
        }
      }
    )
  );

  // Serialize user to session
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  // Deserialize user from session
  passport.deserializeUser((user, done) => {
    done(null, user as Express.User);
  });

  return passport;
};
