import { Sequelize } from "sequelize";
import dotenv from "dotenv";

dotenv.config();

// Database configuration
const DB_NAME = process.env.DB_NAME || "xeno";
const DB_USER = process.env.DB_USER || "root";
const DB_PASSWORD = process.env.DB_PASSWORD || "";
const DB_HOST = process.env.DB_HOST || "localhost";
const DB_PORT = parseInt(process.env.DB_PORT || "3306");

// Create Sequelize instance
const sequelize = new Sequelize({
  database: DB_NAME,
  username: DB_USER,
  password: DB_PASSWORD,
  host: DB_HOST,
  port: DB_PORT,
  dialect: "mysql",
  logging: process.env.NODE_ENV === "development" ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

// Connect to database
export const connectDB = async (): Promise<void> => {
  try {
    // Try to connect to MySQL without specifying the database first
    const tempSequelize = new Sequelize({
      username: DB_USER,
      password: DB_PASSWORD,
      host: DB_HOST,
      port: DB_PORT,
      dialect: "mysql",
      logging: false,
    });

    await tempSequelize.authenticate();

    // Create the database if it doesn't exist
    await tempSequelize.query(`CREATE DATABASE IF NOT EXISTS ${DB_NAME};`);

    // Close temporary connection
    await tempSequelize.close();

    // Now connect to the actual database
    await sequelize.authenticate();
    console.log("MySQL connection has been established successfully.");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
    throw error;
  }
};

// Sync database models
export const syncDB = async (): Promise<void> => {
  try {
    await sequelize.sync({ alter: process.env.NODE_ENV === "development" });
    console.log("Database synchronized successfully");
  } catch (error) {
    console.error("Unable to synchronize the database:", error);
    throw error;
  }
};

export default sequelize;
