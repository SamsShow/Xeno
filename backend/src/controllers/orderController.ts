import { Request, Response } from "express";
import { publishToQueue, ORDER_QUEUE } from "../config/rabbitmq";
import {
  getOrders,
  getOrderById,
  getOrdersByCustomerId,
  updateOrder,
  deleteOrder,
} from "../services/orderService";

// Add a new order - publishes to queue for async processing
export const addOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    // Validation already done through middleware
    const orderData = req.body;

    // Generate a request ID for tracking
    const requestId = Date.now().toString();

    // Publish to queue
    await publishToQueue(ORDER_QUEUE, orderData);

    // Return success response immediately
    res.status(202).json({
      status: "success",
      message: "Order data accepted for processing",
      requestId,
    });
  } catch (error) {
    console.error("Error adding order:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process order data",
    });
  }
};

// Bulk add orders - publishes to queue for async processing
export const addOrdersBulk = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    // Validate request
    if (!Array.isArray(req.body)) {
      res.status(400).json({
        status: "error",
        message: "Request body should be an array of orders",
      });
      return;
    }

    const orders = req.body;
    const requestId = Date.now().toString();

    // Publish each order to the queue
    const publishPromises = orders.map((order) =>
      publishToQueue(ORDER_QUEUE, order)
    );

    await Promise.all(publishPromises);

    res.status(202).json({
      status: "success",
      message: `${orders.length} orders accepted for processing`,
      requestId,
    });
  } catch (error) {
    console.error("Error bulk adding orders:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to process order data",
    });
  }
};

// Get all orders with pagination
export const getAllOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    // Parse any filters from query params
    const filters: Record<string, any> = {};

    // Add filters if provided
    if (req.query.status) filters.status = req.query.status;
    if (req.query.paymentStatus)
      filters.paymentStatus = req.query.paymentStatus;

    // Date range filters
    if (req.query.startDate && req.query.endDate) {
      filters.createdAt = {
        $gte: new Date(req.query.startDate as string),
        $lte: new Date(req.query.endDate as string),
      };
    }

    const result = await getOrders(page, limit, filters);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error("Error getting orders:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve orders",
    });
  }
};

// Get order by ID
export const getOrder = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const order = await getOrderById(id);

    if (!order) {
      res.status(404).json({
        status: "error",
        message: `Order with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: order,
    });
  } catch (error) {
    console.error(`Error getting order with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve order",
    });
  }
};

// Get orders by customer ID
export const getOrdersByCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { customerId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;

    const result = await getOrdersByCustomerId(customerId, page, limit);

    res.status(200).json({
      status: "success",
      data: result,
    });
  } catch (error) {
    console.error(
      `Error getting orders for customer ${req.params.customerId}:`,
      error
    );
    res.status(500).json({
      status: "error",
      message: "Failed to retrieve orders",
    });
  }
};

// Update order status - direct update for immediate consistency when needed
export const updateOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedOrder = await updateOrder(id, updateData);

    if (!updatedOrder) {
      res.status(404).json({
        status: "error",
        message: `Order with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      data: updatedOrder,
    });
  } catch (error) {
    console.error(`Error updating order with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: "error",
      message: "Failed to update order",
    });
  }
};

// Delete order
export const deleteOrderById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const isDeleted = await deleteOrder(id);

    if (!isDeleted) {
      res.status(404).json({
        status: "error",
        message: `Order with ID ${id} not found`,
      });
      return;
    }

    res.status(200).json({
      status: "success",
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error(`Error deleting order with ID ${req.params.id}:`, error);
    res.status(500).json({
      status: "error",
      message: "Failed to delete order",
    });
  }
};
