import { v4 as uuidv4 } from "uuid";
import Customer from "../models/Customer";
import Communication from "../models/Communication";
import { connectDB } from "../config/database";
import sequelize from "../config/database";

const seedCustomers = async () => {
  try {
    // Connect to the database
    await connectDB();

    console.log("Seeding customers...");

    // Define mock customers
    const mockCustomers = [
      {
        id: uuidv4(),
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+1234567890",
        company: "Acme Inc",
        jobTitle: "Software Engineer",
        address: "123 Main St",
        city: "San Francisco",
        state: "CA",
        zipCode: "94105",
        country: "USA",
        notes: "Regular customer",
        tags: ["tech", "premium"],
      },
      {
        id: uuidv4(),
        firstName: "Jane",
        lastName: "Smith",
        email: "jane.smith@example.com",
        phone: "+1987654321",
        company: "Tech Solutions",
        jobTitle: "Product Manager",
        address: "456 Market St",
        city: "New York",
        state: "NY",
        zipCode: "10001",
        country: "USA",
        notes: "VIP customer",
        tags: ["premium", "manager"],
      },
      {
        id: uuidv4(),
        firstName: "Robert",
        lastName: "Johnson",
        email: "robert.johnson@example.com",
        phone: "+1122334455",
        company: "Data Corp",
        jobTitle: "Data Analyst",
        address: "789 Oak St",
        city: "Chicago",
        state: "IL",
        zipCode: "60007",
        country: "USA",
        notes: "New customer",
        tags: ["tech", "analyst"],
      },
      {
        id: uuidv4(),
        firstName: "Emily",
        lastName: "Williams",
        email: "emily.williams@example.com",
        phone: "+1555666777",
        company: "Marketing Pro",
        jobTitle: "Marketing Director",
        address: "321 Pine St",
        city: "Los Angeles",
        state: "CA",
        zipCode: "90001",
        country: "USA",
        notes: "Marketing partner",
        tags: ["marketing", "partner"],
      },
      {
        id: uuidv4(),
        firstName: "Michael",
        lastName: "Brown",
        email: "michael.brown@example.com",
        phone: "+1333444555",
        company: "Design Studio",
        jobTitle: "UI Designer",
        address: "567 Cedar St",
        city: "Miami",
        state: "FL",
        zipCode: "33101",
        country: "USA",
        notes: "Design collaborator",
        tags: ["design", "premium"],
      },
    ];

    // Use a transaction to maintain database integrity
    const transaction = await sequelize.transaction();

    try {
      // First, check if we have existing customers
      const existingCustomers = await Customer.findAll({ transaction });

      if (existingCustomers.length > 0) {
        console.log(
          "Found existing customers, skipping deletion to avoid foreign key conflicts"
        );
        // Instead, ensure our mock customers exist by upserting them
        for (const customer of mockCustomers) {
          await Customer.upsert(customer, { transaction });
        }
      } else {
        // If no existing customers, just create new ones
        for (const customer of mockCustomers) {
          await Customer.create(customer, { transaction });
        }
      }

      // Commit the transaction
      await transaction.commit();
      console.log(`Seeded ${mockCustomers.length} customers successfully!`);
    } catch (error) {
      // Rollback the transaction in case of error
      await transaction.rollback();
      throw error;
    }

    process.exit(0);
  } catch (error) {
    console.error("Error seeding customers:", error);
    process.exit(1);
  }
};

// Run the seeding function
seedCustomers();
