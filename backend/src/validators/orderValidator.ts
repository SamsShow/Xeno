import { body } from "express-validator";
import mongoose from "mongoose";

export const orderValidationRules = [
  body("customerId")
    .notEmpty()
    .withMessage("Customer ID is required")
    .custom((value) => {
      return mongoose.Types.ObjectId.isValid(value);
    })
    .withMessage("Invalid customer ID format"),

  body("items")
    .isArray({ min: 1 })
    .withMessage("Order must have at least one item"),

  body("items.*.productId")
    .notEmpty()
    .withMessage("Product ID is required")
    .isString()
    .withMessage("Product ID must be a string"),

  body("items.*.name")
    .notEmpty()
    .withMessage("Product name is required")
    .isString()
    .withMessage("Product name must be a string"),

  body("items.*.price")
    .notEmpty()
    .withMessage("Product price is required")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number"),

  body("items.*.quantity")
    .notEmpty()
    .withMessage("Product quantity is required")
    .isInt({ min: 1 })
    .withMessage("Quantity must be at least 1"),

  body("totalAmount")
    .notEmpty()
    .withMessage("Total amount is required")
    .isFloat({ min: 0 })
    .withMessage("Total amount must be a positive number")
    .custom((value, { req }) => {
      const items = req.body.items || [];
      const calculatedTotal = items.reduce(
        (sum: number, item: any) => sum + item.price * item.quantity,
        0
      );
      // Allow a small difference due to floating point calculations
      return Math.abs(calculatedTotal - value) < 0.01;
    })
    .withMessage("Total amount does not match with the sum of item prices"),

  body("status")
    .optional()
    .isIn(["pending", "processing", "completed", "cancelled"])
    .withMessage("Invalid order status"),

  body("paymentMethod")
    .notEmpty()
    .withMessage("Payment method is required")
    .isString()
    .withMessage("Payment method must be a string"),

  body("paymentStatus")
    .optional()
    .isIn(["unpaid", "paid", "refunded"])
    .withMessage("Invalid payment status"),

  body("shippingAddress")
    .optional()
    .isObject()
    .withMessage("Shipping address must be an object"),

  body("shippingAddress.street")
    .optional()
    .isString()
    .withMessage("Street must be a string"),

  body("shippingAddress.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),

  body("shippingAddress.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),

  body("shippingAddress.zipCode")
    .optional()
    .isString()
    .withMessage("Zip code must be a string"),

  body("shippingAddress.country")
    .optional()
    .isString()
    .withMessage("Country must be a string"),

  body("metadata")
    .optional()
    .isObject()
    .withMessage("Metadata must be an object"),
];
