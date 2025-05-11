import express from "express";
import {
  addOrder,
  addOrdersBulk,
  getAllOrders,
  getOrder,
  getOrdersByCustomer,
  updateOrderById,
  deleteOrderById,
} from "../controllers/orderController";
import { validate } from "../middleware/validate";
import { orderValidationRules } from "../validators/orderValidator";

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Add a new order
 *     description: Adds a new order to the system (async processing via queue)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       202:
 *         description: Order data accepted for processing
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/", validate(orderValidationRules), addOrder);

/**
 * @swagger
 * /api/orders/bulk:
 *   post:
 *     summary: Add multiple orders
 *     description: Add multiple orders in bulk (async processing via queue)
 *     tags: [Orders]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: array
 *             items:
 *               $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       202:
 *         description: Orders data accepted for processing
 *       400:
 *         description: Validation error
 *       500:
 *         description: Server error
 */
router.post("/bulk", addOrdersBulk);

/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders
 *     description: Retrieve all orders with pagination and filtering
 *     tags: [Orders]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [pending, processing, completed, cancelled]
 *         description: Filter by order status
 *       - in: query
 *         name: paymentStatus
 *         schema:
 *           type: string
 *           enum: [unpaid, paid, refunded]
 *         description: Filter by payment status
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date (ISO format)
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date (ISO format)
 *     responses:
 *       200:
 *         description: A list of orders
 *       500:
 *         description: Server error
 */
router.get("/", getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get order by ID
 *     description: Retrieve a single order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order data
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.get("/:id", getOrder);

/**
 * @swagger
 * /api/orders/customer/{customerId}:
 *   get:
 *     summary: Get orders by customer ID
 *     description: Retrieve all orders for a specific customer
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: customerId
 *         required: true
 *         schema:
 *           type: string
 *         description: Customer ID
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 50
 *         description: Number of items per page
 *     responses:
 *       200:
 *         description: A list of customer orders
 *       500:
 *         description: Server error
 */
router.get("/customer/:customerId", getOrdersByCustomer);

/**
 * @swagger
 * /api/orders/{id}:
 *   put:
 *     summary: Update order
 *     description: Update an existing order
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/OrderInput'
 *     responses:
 *       200:
 *         description: Updated order data
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.put("/:id", validate(orderValidationRules), updateOrderById);

/**
 * @swagger
 * /api/orders/{id}:
 *   delete:
 *     summary: Delete order
 *     description: Delete an order by ID
 *     tags: [Orders]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     responses:
 *       200:
 *         description: Order deleted successfully
 *       404:
 *         description: Order not found
 *       500:
 *         description: Server error
 */
router.delete("/:id", deleteOrderById);

export default router;
