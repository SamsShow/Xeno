import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv";
import { connectDB, syncDB } from "./config/database";
import { connectRabbitMQ, closeRabbitMQ } from "./config/rabbitmq";
import { setupSwagger } from "./swagger";
import { startCustomerConsumer } from "./consumers/customerConsumer";
import { startOrderConsumer } from "./consumers/orderConsumer";
import customerRoutes from "./routes/customerRoutes";
import orderRoutes from "./routes/orderRoutes";
import authRoutes from "./routes/authRoutes";
import aiRoutes from "./routes/aiRoutes";
import campaignRoutes from "./routes/campaignRoutes";
import analyticsRoutes from "./routes/analyticsRoutes";
import communicationRoutes from "./routes/communicationRoutes";
import { authenticate } from "./middleware/auth";
import { initializePassport } from "./config/passport";
import fixUserIndexes from "./scripts/fixUserIndexes";

// Load environment variables
dotenv.config();

const app = express();

// Initialize passport
const passport = initializePassport();

// Connect to Database and sync models
const setupDatabase = async () => {
  try {
    await connectDB();

    // Check if the environment flag to skip sync is set
    if (process.env.SKIP_DB_SYNC === "true") {
      console.log("Skipping database sync due to SKIP_DB_SYNC flag");
      return;
    }

    try {
      // Try to sync the database normally
      await syncDB();
    } catch (error) {
      console.error("Failed to setup database:", error);

      // If the error is related to too many keys on the users table, run the fix
      if (
        error.name === "SequelizeDatabaseError" &&
        error.original &&
        error.original.code === "ER_TOO_MANY_KEYS" &&
        error.sql.includes("users")
      ) {
        console.log(
          "Detected 'Too many keys' error on users table. Attempting to fix..."
        );

        // Run the index fix script with closeConnection = false to keep the connection open
        await fixUserIndexes(false);

        // Try sync again after fixing
        console.log("Retrying database sync after index fix...");
        await syncDB();
      } else {
        // If it's another error, rethrow it
        throw error;
      }
    }

    console.log("Database setup completed successfully");
  } catch (error) {
    console.error("Failed to setup database:", error);
    throw error;
  }
};

setupDatabase();

// Connect to RabbitMQ and start consumers (only if enabled)
const ENABLE_RABBITMQ = process.env.ENABLE_RABBITMQ === "true";

const setupPubSub = async () => {
  if (!ENABLE_RABBITMQ) {
    console.log("RabbitMQ integration is disabled. Skipping connection.");
    return;
  }

  try {
    await connectRabbitMQ();

    // Start message consumers
    await startCustomerConsumer();
    await startOrderConsumer();

    console.log("Pub/Sub system initialized successfully");
  } catch (error) {
    console.error("Failed to initialize pub/sub system:", error);
    // Don't exit the process, allow app to continue without RabbitMQ
    console.log("Continuing without RabbitMQ integration");
  }
};

setupPubSub();

// Setup Swagger
setupSwagger(app);

// Middleware
app.use(cors());
app.use(helmet());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(passport.initialize());

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", authenticate, customerRoutes);
app.use("/api/orders", authenticate, orderRoutes);
app.use("/api/ai", authenticate, aiRoutes);
app.use("/api/campaigns", authenticate, campaignRoutes);
app.use("/api/analytics", authenticate, analyticsRoutes);
app.use("/api/communications", communicationRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "ok",
    timestamp: new Date().toISOString(),
    rabbitmq: ENABLE_RABBITMQ ? "enabled" : "disabled",
  });
});

// Basic route
app.get("/", (req, res) => {
  res.json({
    message: "Welcome to Xeno API",
    docs: "/api-docs",
  });
});

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err.stack);
    res.status(500).json({
      status: "error",
      message: "An unexpected error occurred",
    });
  }
);

const PORT = process.env.PORT || 3000;

const server = app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Handle application shutdown gracefully
const gracefulShutdown = async () => {
  console.log("Shutting down gracefully...");

  // Close server
  server.close(() => {
    console.log("HTTP server closed");
  });

  try {
    // Close RabbitMQ connection if enabled
    if (ENABLE_RABBITMQ) {
      await closeRabbitMQ();
    }

    console.log("All connections closed");
    process.exit(0);
  } catch (error) {
    console.error("Error during shutdown:", error);
    process.exit(1);
  }
};

// Listen for termination signals
process.on("SIGTERM", gracefulShutdown);
process.on("SIGINT", gracefulShutdown);

export default app;
