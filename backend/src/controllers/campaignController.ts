import { Request, Response } from "express";
import Campaign from "../models/Campaign";

// GET /api/campaigns
export const getCampaigns = async (req: Request, res: Response) => {
  try {
    const campaigns = await Campaign.findAll({
      order: [["createdAt", "DESC"]],
    });
    res.json(campaigns);
  } catch (error) {
    console.error("Error fetching campaigns:", error);
    res.status(500).json({ error: "Failed to fetch campaigns" });
  }
};

// GET /api/campaigns/:id
export const getCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });
    res.json(campaign);
  } catch (error) {
    console.error("Error fetching campaign:", error);
    res.status(500).json({ error: "Failed to fetch campaign" });
  }
};

// POST /api/campaigns
export const createCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.create({
      name: req.body.name,
      description: req.body.description,
      objective: req.body.objective || "General marketing",
      status: "draft",
      channel: req.body.channel || "email",
      content: req.body.content || "",
      targetAudience: JSON.stringify(req.body.rules),
      metrics: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
      },
    });
    res.status(201).json(campaign);
  } catch (error) {
    console.error("Error creating campaign:", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

// PUT /api/campaigns/:id
export const updateCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    await campaign.update(req.body);
    res.json(campaign);
  } catch (error) {
    console.error("Error updating campaign:", error);
    res.status(500).json({ error: "Failed to update campaign" });
  }
};

// PUT /api/campaigns/:id/status
export const updateStatus = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    await campaign.update({
      status: req.body.status,
      // If status is changing to active/sent, update the sentDate
      sentDate:
        req.body.status === "active" || req.body.status === "completed"
          ? new Date()
          : campaign.sentDate,
    });

    res.json(campaign);
  } catch (error) {
    console.error("Error updating campaign status:", error);
    res.status(500).json({ error: "Failed to update campaign status" });
  }
};

// PUT /api/campaigns/:id/metrics
export const updateMetrics = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    // Update metrics while preserving any existing metrics not in the request
    const currentMetrics = campaign.metrics || {};
    const newMetrics = { ...currentMetrics, ...req.body.metrics };

    await campaign.update({ metrics: newMetrics });
    res.json(campaign);
  } catch (error) {
    console.error("Error updating campaign metrics:", error);
    res.status(500).json({ error: "Failed to update campaign metrics" });
  }
};

// DELETE /api/campaigns/:id
export const deleteCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    await campaign.destroy();
    res.status(204).end();
  } catch (error) {
    console.error("Error deleting campaign:", error);
    res.status(500).json({ error: "Failed to delete campaign" });
  }
};

// GET /api/campaigns/:id/audience
export const getCampaignAudience = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    const customers = await campaign.getCustomers();
    res.json(customers);
  } catch (error) {
    console.error("Error fetching campaign audience:", error);
    res.status(500).json({ error: "Failed to fetch campaign audience" });
  }
};

// POST /api/campaigns/:id/send
export const sendCampaign = async (req: Request, res: Response) => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    // Update status to active/sent
    await campaign.update({
      status: "active",
      sentDate: new Date(),
    });

    // In a real app, you would initiate sending the campaign to customers here
    // For now, we'll just update the metrics to simulate sending
    const audienceCount = await campaign.countCustomers();
    const sent = audienceCount || 100; // Fallback to 100 if no audience count

    const metrics = {
      sent: sent,
      delivered: Math.floor(sent * 0.95), // 95% delivery rate
      opened: Math.floor(sent * 0.6), // 60% open rate
      clicked: Math.floor(sent * 0.2), // 20% click rate
      converted: Math.floor(sent * 0.05), // 5% conversion rate
    };

    await campaign.update({ metrics });

    res.json({
      message: "Campaign sent successfully",
      campaign,
    });
  } catch (error) {
    console.error("Error sending campaign:", error);
    res.status(500).json({ error: "Failed to send campaign" });
  }
};

// GET /api/campaigns/:id/delivery
export const getCampaignDeliveryInfo = async (req: Request, res: Response) => {
  try {
    const campaignId = req.params.id;
    const campaign = await Campaign.findByPk(campaignId);

    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    // In a real implementation, this would fetch from your database
    // For now, we'll return the metrics stored in the campaign
    const deliveryInfo = {
      sent: campaign.metrics?.sent || 0,
      delivered: campaign.metrics?.delivered || 0,
      opened: campaign.metrics?.opened || 0,
      clicked: campaign.metrics?.clicked || 0,
      failed: campaign.metrics?.failed || 0,
      pending: campaign.metrics?.pending || 0,
      // You can add more detailed stats as needed
      details: {
        lastUpdated: new Date().toISOString(),
        deliveryRate:
          campaign.metrics?.sent > 0
            ? (
                (campaign.metrics?.delivered / campaign.metrics?.sent) *
                100
              ).toFixed(2) + "%"
            : "0%",
        failureRate:
          campaign.metrics?.sent > 0
            ? (
                (campaign.metrics?.failed / campaign.metrics?.sent) *
                100
              ).toFixed(2) + "%"
            : "0%",
      },
    };

    res.json(deliveryInfo);
  } catch (error) {
    console.error("Error fetching campaign delivery info:", error);
    res
      .status(500)
      .json({ error: "Failed to fetch campaign delivery information" });
  }
};
