/**
 * This script fixes the "Too many keys" issue with the users table
 * by recreating the table with only the necessary indexes.
 */

import sequelize from "../config/database";
import { QueryTypes } from "sequelize";
import { connectDB } from "../config/database";

// Define interface for MySQL index structure
interface MySQLIndex {
  Table: string;
  Non_unique: number;
  Key_name: string;
  Seq_in_index: number;
  Column_name: string;
  Collation: string | null;
  Cardinality: number;
  Sub_part: number | null;
  Packed: string | null;
  Null: string;
  Index_type: string;
  Comment: string;
  Index_comment: string;
  Visible: string;
  Expression: string | null;
}

async function fixUserIndexes(closeConnection = true) {
  try {
    console.log("Starting user index fix migration...");

    // Connect to database
    await connectDB();

    // Check if the users table exists
    const [tables] = await sequelize.query("SHOW TABLES LIKE 'users'", {
      type: QueryTypes.SELECT,
    });

    if (!tables) {
      console.log("Users table doesn't exist yet. No fixes needed.");
      return;
    }

    // Get current indexes to display
    const indexes = await sequelize.query<MySQLIndex>("SHOW INDEX FROM users", {
      type: QueryTypes.SELECT,
    });

    console.log("Current indexes on users table:", indexes.length);

    // Create a backup of users table
    console.log("Creating users_backup table...");
    await sequelize.query("CREATE TABLE IF NOT EXISTS users_backup LIKE users");
    await sequelize.query("INSERT INTO users_backup SELECT * FROM users");

    // Drop excessive indexes to fix the "too many keys" issue
    console.log("Dropping excessive indexes...");

    // Get a list of all non-primary indexes
    const nonPrimaryIndexes = await sequelize.query<MySQLIndex>(
      "SHOW INDEX FROM users WHERE Key_name != 'PRIMARY'",
      { type: QueryTypes.SELECT }
    );

    // Track processed index names to avoid duplicates
    const processedIndexes = new Set();

    // Drop each index (except PRIMARY)
    for (const index of nonPrimaryIndexes) {
      const indexName = index.Key_name;
      if (!processedIndexes.has(indexName)) {
        try {
          console.log(`Dropping index ${indexName}...`);
          await sequelize.query(`DROP INDEX \`${indexName}\` ON users`);
          processedIndexes.add(indexName);
        } catch (err) {
          console.error(`Failed to drop index ${indexName}:`, err.message);
        }
      }
    }

    // Create only necessary indexes (email unique, googleId non-unique)
    console.log("Creating necessary indexes...");
    try {
      // Email should be unique
      await sequelize.query("CREATE UNIQUE INDEX email_idx ON users (email)");
      // GoogleId should be indexed but not necessarily unique
      await sequelize.query("CREATE INDEX googleId_idx ON users (googleId)");

      console.log("Index migration completed successfully!");
    } catch (err) {
      console.error("Failed to create new indexes:", err.message);
      console.log("Rolling back to backup...");
      await sequelize.query("DROP TABLE users");
      await sequelize.query("RENAME TABLE users_backup TO users");
      throw err;
    }

    // Check if everything is working
    const newIndexes = await sequelize.query<MySQLIndex>(
      "SHOW INDEX FROM users",
      {
        type: QueryTypes.SELECT,
      }
    );

    console.log(
      `New index count: ${newIndexes.length} (from ${indexes.length})`
    );
    console.log("Users table has been fixed successfully!");
  } catch (error) {
    console.error("Migration failed:", error);
    if (closeConnection) {
      process.exit(1);
    } else {
      throw error;
    }
  } finally {
    // Only close the connection if we're running as a standalone script
    if (closeConnection) {
      await sequelize.close();
    }
  }
}

// Run the migration when script is executed directly
if (require.main === module) {
  fixUserIndexes(true)
    .then(() => process.exit(0))
    .catch((err) => {
      console.error("Error in migration:", err);
      process.exit(1);
    });
}

export default fixUserIndexes;
