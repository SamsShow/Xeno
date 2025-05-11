import { Customer } from "../models";
import { Op } from "sequelize";

export interface CustomerInput {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  company?: string;
  jobTitle?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  country?: string;
  notes?: string;
  tags?: string[];
}

// Process customer data in batches
export const processBatch = async (
  customers: CustomerInput[]
): Promise<void> => {
  try {
    console.log(`Processing batch of ${customers.length} customers`);

    // Process customers in chunks to avoid memory issues
    const batchSize = 100;
    for (let i = 0; i < customers.length; i += batchSize) {
      const batch = customers.slice(
        i,
        Math.min(i + batchSize, customers.length)
      );

      // Use bulkCreate with updateOnDuplicate option
      await Customer.bulkCreate(batch, {
        updateOnDuplicate: ["email"],
      });
    }

    console.log("Customer batch processing completed");
  } catch (error) {
    console.error("Error processing customer batch:", error);
    throw error;
  }
};

// Add individual customer
export const createCustomer = async (
  customerData: CustomerInput
): Promise<any> => {
  try {
    // Check if customer already exists
    const existingCustomer = await Customer.findOne({
      where: { email: customerData.email },
    });

    if (existingCustomer) {
      // Update existing customer
      await existingCustomer.update(customerData);
      return existingCustomer;
    } else {
      // Create new customer
      return await Customer.create(customerData);
    }
  } catch (error) {
    console.error("Error creating customer:", error);
    throw error;
  }
};

// Get all customers with pagination
export const getCustomers = async (
  page: number = 1,
  limit: number = 50,
  filters: Record<string, any> = {}
): Promise<{
  customers: any[];
  total: number;
  page: number;
  totalPages: number;
}> => {
  try {
    const offset = (page - 1) * limit;

    // Convert filters to Sequelize where clause
    const whereClause: any = {};

    if (filters.name) {
      whereClause[Op.or] = [
        { firstName: { [Op.like]: `%${filters.name}%` } },
        { lastName: { [Op.like]: `%${filters.name}%` } },
      ];
    }

    if (filters.email) {
      whereClause.email = { [Op.like]: `%${filters.email}%` };
    }

    if (filters.phone) {
      whereClause.phone = { [Op.like]: `%${filters.phone}%` };
    }

    const { count, rows: customers } = await Customer.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      customers,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting customers:", error);
    throw error;
  }
};

// Get customer by ID
export const getCustomerById = async (id: string): Promise<any | null> => {
  try {
    return await Customer.findByPk(id, {
      include: ["communications", "campaigns"],
    });
  } catch (error) {
    console.error(`Error getting customer with ID ${id}:`, error);
    throw error;
  }
};

// Update customer
export const updateCustomer = async (
  id: string,
  updateData: Partial<CustomerInput>
): Promise<any | null> => {
  try {
    const customer = await Customer.findByPk(id);

    if (!customer) {
      return null;
    }

    await customer.update(updateData);
    return customer;
  } catch (error) {
    console.error(`Error updating customer with ID ${id}:`, error);
    throw error;
  }
};

// Delete customer
export const deleteCustomer = async (id: string): Promise<boolean> => {
  try {
    const result = await Customer.destroy({
      where: { id },
    });

    return result > 0;
  } catch (error) {
    console.error(`Error deleting customer with ID ${id}:`, error);
    throw error;
  }
};
