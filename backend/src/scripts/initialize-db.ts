import { connectDB, syncDB } from "../config/database";
import { Customer, Campaign, Communication, User } from "../models";

async function initializeDatabase() {
  try {
    // Connect to database
    await connectDB();

    // Sync all models with database
    await syncDB();

    console.log("Database initialized successfully!");

    // Check if we need to seed initial data
    const userCount = await User.count();

    if (userCount === 0) {
      console.log("Seeding initial data...");

      // Create admin user
      const adminUser = await User.create({
        email: "admin@xeno.com",
        name: "Admin User",
        role: "admin",
        active: true,
      });

      console.log("Created admin user:", adminUser.email);

      // Create sample customers
      const customers = await Customer.bulkCreate([
        {
          firstName: "John",
          lastName: "Doe",
          email: "john.doe@example.com",
          phone: "555-123-4567",
          company: "Acme Inc",
          jobTitle: "CEO",
          address: "123 Main St",
          city: "New York",
          state: "NY",
          zipCode: "10001",
          country: "USA",
          tags: ["vip", "tech"],
        },
        {
          firstName: "Jane",
          lastName: "Smith",
          email: "jane.smith@example.com",
          phone: "555-987-6543",
          company: "Tech Corp",
          jobTitle: "CTO",
          address: "456 Park Ave",
          city: "San Francisco",
          state: "CA",
          zipCode: "94107",
          country: "USA",
          tags: ["tech", "marketing"],
        },
      ]);

      console.log(`Created ${customers.length} sample customers`);

      // Create sample campaign
      const campaign = await Campaign.create({
        name: "Welcome Campaign",
        description: "Onboarding campaign for new customers",
        objective: "Introduce product features",
        status: "active",
        channel: "email",
        content:
          "Welcome to our platform! We are excited to have you on board.",
        metrics: {
          sent: 2,
          delivered: 2,
          opened: 1,
          clicked: 0,
          converted: 0,
        },
        tags: ["onboarding", "welcome"],
      });

      console.log(`Created sample campaign: ${campaign.name}`);

      // Associate customers with campaign using proper association method
      await (campaign as any).addCustomers(customers);

      // Create sample communications
      for (const customer of customers) {
        await Communication.create({
          type: "email",
          status: "delivered",
          content:
            "Welcome to our platform! We are excited to have you on board.",
          subject: "Welcome to Xeno CRM",
          customerId: customer.id,
          campaignId: campaign.id,
          sentAt: new Date(),
          deliveredAt: new Date(),
        });
      }

      console.log(`Created sample communications`);
    }

    process.exit(0);
  } catch (error) {
    console.error("Error initializing database:", error);
    process.exit(1);
  }
}

// Run the initialization
initializeDatabase();
