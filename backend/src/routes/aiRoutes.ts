import express from "express";
import { authenticate } from "../middleware/auth";
import { aiService } from "../services/aiService";

const router = express.Router();

/**
 * @swagger
 * /api/ai/message-suggestions:
 *   post:
 *     summary: Generate message suggestions
 *     description: Generate AI-powered message suggestions based on campaign objective and details
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - objective
 *             properties:
 *               objective:
 *                 type: string
 *                 description: Campaign objective
 *               audienceDetails:
 *                 type: string
 *                 description: Details about the target audience
 *               productDetails:
 *                 type: string
 *                 description: Details about the product or service
 *               count:
 *                 type: number
 *                 description: Number of suggestions to generate
 *                 default: 3
 *     responses:
 *       200:
 *         description: Message suggestions generated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/message-suggestions", authenticate, async (req, res) => {
  try {
    const { objective, audienceDetails, productDetails, count } = req.body;

    if (!objective) {
      return res.status(400).json({
        status: "error",
        message: "Campaign objective is required",
      });
    }

    const suggestions = await aiService.generateMessageSuggestions(
      objective,
      audienceDetails || "",
      productDetails || "",
      count || 3
    );

    res.json({
      status: "success",
      data: suggestions,
    });
  } catch (error) {
    console.error("Error generating message suggestions:", error);
    res.status(500).json({
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate message suggestions",
    });
  }
});

/**
 * @swagger
 * /api/ai/campaign-insights:
 *   post:
 *     summary: Generate campaign insights
 *     description: Generate AI-powered insights based on campaign performance data
 *     tags: [AI]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - campaignName
 *               - audienceSize
 *               - messagesSent
 *               - messagesDelivered
 *             properties:
 *               campaignName:
 *                 type: string
 *                 description: Campaign name
 *               objective:
 *                 type: string
 *                 description: Campaign objective
 *               audienceSize:
 *                 type: number
 *                 description: Total audience size
 *               messagesSent:
 *                 type: number
 *                 description: Number of messages sent
 *               messagesDelivered:
 *                 type: number
 *                 description: Number of messages delivered
 *               audienceSegments:
 *                 type: object
 *                 description: Segments with delivery stats
 *     responses:
 *       200:
 *         description: Campaign insights generated successfully
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */
router.post("/campaign-insights", authenticate, async (req, res) => {
  try {
    const {
      campaignName,
      objective,
      audienceSize,
      messagesSent,
      messagesDelivered,
      audienceSegments,
    } = req.body;

    // Validate required fields
    if (!campaignName || !audienceSize || !messagesSent || !messagesDelivered) {
      return res.status(400).json({
        status: "error",
        message: "Missing required campaign data",
      });
    }

    const insights = await aiService.generateCampaignInsights(
      campaignName,
      objective || "General marketing",
      audienceSize,
      messagesSent,
      messagesDelivered,
      audienceSegments || {}
    );

    res.json({
      status: "success",
      data: insights,
    });
  } catch (error) {
    console.error("Error generating campaign insights:", error);
    res.status(500).json({
      status: "error",
      message:
        error instanceof Error
          ? error.message
          : "Failed to generate campaign insights",
    });
  }
});

export default router;
