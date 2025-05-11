import { Order } from "../models";
import { Op } from "sequelize";
import { v4 as uuidv4 } from "uuid";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface OrderInput {
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status?: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: string;
  paymentStatus?: "unpaid" | "paid" | "refunded";
  shippingAddress?: {
    street?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
  };
  metadata?: Record<string, any>;
}

// Process order data in batches
export const processBatch = async (orders: OrderInput[]): Promise<void> => {
  try {
    console.log(`Processing batch of ${orders.length} orders`);

    // Process orders in chunks to avoid memory issues
    const batchSize = 50;
    for (let i = 0; i < orders.length; i += batchSize) {
      const batch = orders.slice(i, Math.min(i + batchSize, orders.length));

      // Create operation promises
      const operations = batch.map((orderData) => {
        return Order.create(orderData);
      });

      // Execute all operations in parallel
      await Promise.all(operations);
    }

    console.log("Order batch processing completed");
  } catch (error) {
    console.error("Error processing order batch:", error);
    throw error;
  }
};

// Create a single order
export const createOrder = async (orderData: OrderInput) => {
  try {
    const order = await Order.create(orderData);
    return order;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};

// Get all orders with pagination
export const getOrders = async (
  page: number = 1,
  limit: number = 50,
  filters: Record<string, any> = {}
) => {
  try {
    const offset = (page - 1) * limit;

    // Convert MongoDB filter format to Sequelize format
    const whereClause: any = {};

    if (filters.status) whereClause.status = filters.status;
    if (filters.paymentStatus)
      whereClause.paymentStatus = filters.paymentStatus;

    // Date range filters
    if (filters.createdAt) {
      whereClause.createdAt = {
        [Op.gte]: filters.createdAt.$gte,
        [Op.lte]: filters.createdAt.$lte,
      };
    }

    const { count, rows: orders } = await Order.findAndCountAll({
      where: whereClause,
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      orders,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error("Error getting orders:", error);
    throw error;
  }
};

// Get order by ID
export const getOrderById = async (id: string) => {
  try {
    return await Order.findByPk(id);
  } catch (error) {
    console.error(`Error getting order with ID ${id}:`, error);
    throw error;
  }
};

// Get orders by customer ID
export const getOrdersByCustomerId = async (
  customerId: string,
  page: number = 1,
  limit: number = 50
) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows: orders } = await Order.findAndCountAll({
      where: { customerId },
      limit,
      offset,
      order: [["createdAt", "DESC"]],
    });

    return {
      orders,
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
    };
  } catch (error) {
    console.error(`Error getting orders for customer ${customerId}:`, error);
    throw error;
  }
};

// Update order
export const updateOrder = async (
  id: string,
  updateData: Partial<OrderInput>
) => {
  try {
    const [updatedCount] = await Order.update(updateData, {
      where: { id },
    });

    if (updatedCount === 0) {
      return null;
    }

    return await Order.findByPk(id);
  } catch (error) {
    console.error(`Error updating order with ID ${id}:`, error);
    throw error;
  }
};

// Delete order
export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    const deletedCount = await Order.destroy({
      where: { id },
    });
    return deletedCount > 0;
  } catch (error) {
    console.error(`Error deleting order with ID ${id}:`, error);
    throw error;
  }
};
