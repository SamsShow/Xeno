import express from "express";
import analyticsService from "../services/analyticsService";
import { authenticate } from "../middleware/auth";

const router = express.Router();

// Get aggregate metrics
router.get("/aggregate", authenticate, async (req, res) => {
  try {
    const metrics = await analyticsService.getAggregateMetrics();
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching aggregate metrics:", error);
    res.status(500).json({ error: "Failed to fetch aggregate metrics" });
  }
});

// Get customer metrics
router.get("/customer-metrics", authenticate, async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const metrics = await analyticsService.getCustomerMetrics(
      customerId as string
    );
    res.json(metrics);
  } catch (error) {
    console.error("Error fetching customer metrics:", error);
    res.status(500).json({ error: "Failed to fetch customer metrics" });
  }
});

// Get predictive analytics
router.get("/predictive", authenticate, async (req, res) => {
  try {
    const { customerId } = req.query;
    if (!customerId) {
      return res.status(400).json({ error: "Customer ID is required" });
    }

    const predictions = await analyticsService.getPredictiveAnalytics(
      customerId as string
    );
    res.json(predictions);
  } catch (error) {
    console.error("Error fetching predictive analytics:", error);
    res.status(500).json({ error: "Failed to fetch predictive analytics" });
  }
});

export default router;
