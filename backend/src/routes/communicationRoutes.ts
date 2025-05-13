import express from "express";
import { authenticate } from "../middleware/auth";
import Communication from "../models/Communication";
import Customer from "../models/Customer";

const router = express.Router();

// Get all communications
router.get("/", authenticate, async (req, res) => {
  try {
    const communications = await Communication.findAll({
      include: ["customer", "campaign"],
      order: [["createdAt", "DESC"]],
    });
    res.json({
      status: "success",
      data: communications,
    });
  } catch (error) {
    console.error("Error fetching communications:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch communications",
    });
  }
});

// Get communication by ID
router.get("/:id", authenticate, async (req, res) => {
  try {
    const communication = await Communication.findByPk(req.params.id, {
      include: ["customer", "campaign"],
    });

    if (!communication) {
      return res.status(404).json({
        status: "error",
        message: "Communication not found",
      });
    }

    res.json({
      status: "success",
      data: communication,
    });
  } catch (error) {
    console.error("Error fetching communication:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to fetch communication",
    });
  }
});

// Send individual message
router.post("/send", authenticate, async (req, res) => {
  try {
    const { customerId, type, subject, content } = req.body;

    // Validate request
    if (!customerId || !type || !content) {
      return res.status(400).json({
        status: "error",
        message: "Missing required fields: customerId, type, content",
      });
    }

    // Check if customer exists
    const customer = await Customer.findByPk(customerId);
    if (!customer) {
      return res.status(404).json({
        status: "error",
        message: "Customer not found",
      });
    }

    // Create communication record
    const communication = await Communication.create({
      customerId,
      type,
      subject,
      content,
      status: "pending",
      sentAt: new Date(),
    });

    // Simulate sending message with 90% success rate
    const isSuccess = Math.random() < 0.9;

    // Update status based on simulated sending
    setTimeout(async () => {
      if (isSuccess) {
        await communication.update({
          status: "sent",
          deliveredAt: new Date(),
        });
      } else {
        await communication.update({
          status: "failed",
          metadata: {
            failureReason: [
              "network error",
              "invalid recipient",
              "service unavailable",
            ][Math.floor(Math.random() * 3)],
          },
        });
      }
    }, 1000 + Math.random() * 2000);

    res.status(201).json({
      status: "success",
      message: "Message queued for delivery",
      data: communication,
    });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to send message",
    });
  }
});

export default router;
