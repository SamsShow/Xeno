import axios from "axios";
import { Campaign, RuleGroup } from "../types/campaign";

const API_URL = "/api/campaigns";

export const campaignService = {
  // Get all campaigns sorted by creation date (newest first)
  getCampaigns: async (): Promise<Campaign[]> => {
    try {
      const response = await axios.get(API_URL);
      return transformBackendCampaigns(response.data);
    } catch (error) {
      console.error("Error fetching campaigns:", error);
      return [];
    }
  },

  // Get a single campaign by ID
  getCampaign: async (id: string): Promise<Campaign | undefined> => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return transformBackendCampaign(response.data);
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error);
      return undefined;
    }
  },

  // Create a new campaign
  createCampaign: async (
    name: string,
    description: string,
    rules: RuleGroup
  ): Promise<Campaign> => {
    try {
      const response = await axios.post(API_URL, {
        name,
        description,
        rules,
        channel: "email", // Default to email
        content: "", // Content will be filled later
      });
      return transformBackendCampaign(response.data);
    } catch (error) {
      console.error("Error creating campaign:", error);
      throw new Error("Failed to create campaign");
    }
  },

  // Calculate audience size for a rule (would be an API call in real app)
  calculateAudienceSize: (rules: RuleGroup): number => {
    // This could be a real API call to the backend to calculate audience size
    // For now, return a random number between 500 and 10000
    return Math.floor(Math.random() * 9500) + 500;
  },

  // Deliver a campaign to its audience
  deliverCampaign: async (campaignId: string): Promise<void> => {
    try {
      await axios.post(`${API_URL}/${campaignId}/send`);
    } catch (error) {
      console.error(`Error delivering campaign ${campaignId}:`, error);
      throw new Error("Failed to deliver campaign");
    }
  },

  // Update campaign status
  updateCampaignStatus: async (
    campaignId: string,
    status: string
  ): Promise<void> => {
    try {
      await axios.put(`${API_URL}/${campaignId}/status`, { status });
    } catch (error) {
      console.error(`Error updating campaign status ${campaignId}:`, error);
      throw new Error("Failed to update campaign status");
    }
  },

  // Update campaign statistics
  updateCampaignStats: async (
    campaignId: string,
    metrics: any
  ): Promise<void> => {
    try {
      await axios.put(`${API_URL}/${campaignId}/metrics`, { metrics });
    } catch (error) {
      console.error(`Error updating campaign metrics ${campaignId}:`, error);
      throw new Error("Failed to update campaign metrics");
    }
  },

  // Get insights using AI
  getInsights: async (campaignId: string) => {
    try {
      const campaign = await campaignService.getCampaign(campaignId);

      if (!campaign) {
        return null;
      }

      // In a real app, you would call an AI endpoint here
      // This is placeholder data based on campaign metrics
      const metrics = campaign.stats || {
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 0,
      };

      // Sample insights
      return {
        summary: `Campaign ${campaign.name} performance analysis`,
        keyMetrics: {
          sent: metrics.sent,
          delivered: metrics.delivered,
          engagementRate:
            metrics.sent > 0 ? (metrics.delivered / metrics.sent) * 100 : 0,
        },
        recommendations: [
          "Consider segmenting your audience further for better engagement",
          "Test different message variations to improve conversion rates",
          "Schedule campaigns during peak engagement hours",
        ],
        audienceInsights: {
          topSegments: [
            {
              name: "High-value customers",
              engagement: "35% open rate",
            },
            {
              name: "New customers",
              engagement: "28% open rate",
            },
          ],
        },
      };
    } catch (error) {
      console.error(
        `Error getting insights for campaign ${campaignId}:`,
        error
      );
      return null;
    }
  },
};

// Helper function to transform backend campaign model to frontend campaign model
function transformBackendCampaign(backendCampaign: any): Campaign {
  // Parse targetAudience (rules) from JSON string if needed
  let rules: RuleGroup;
  try {
    rules =
      typeof backendCampaign.targetAudience === "string"
        ? JSON.parse(backendCampaign.targetAudience)
        : backendCampaign.targetAudience;
  } catch (e) {
    // Fallback to empty rule group
    rules = {
      id: "1",
      operator: "AND",
      conditions: [],
    };
  }

  // Map backend metrics to frontend stats
  const stats = {
    sent: backendCampaign.metrics?.sent || 0,
    delivered: backendCampaign.metrics?.delivered || 0,
    failed: backendCampaign.metrics?.failed || 0,
    pending: backendCampaign.metrics?.pending || 0,
  };

  // Transform status if needed
  // Backend: "draft", "scheduled", "active", "completed", "cancelled"
  // Frontend: "draft", "sent", "scheduled"
  let status: "draft" | "sent" | "scheduled" = "draft";
  if (
    backendCampaign.status === "active" ||
    backendCampaign.status === "completed"
  ) {
    status = "sent";
  } else if (backendCampaign.status === "scheduled") {
    status = "scheduled";
  }

  return {
    id: backendCampaign.id,
    name: backendCampaign.name,
    description: backendCampaign.description || "",
    rules,
    objective: backendCampaign.objective,
    audienceSize: backendCampaign.audienceSize || 0,
    status,
    createdAt: backendCampaign.createdAt,
    updatedAt: backendCampaign.updatedAt,
    stats,
  };
}

// Transform an array of backend campaigns
function transformBackendCampaigns(backendCampaigns: any[]): Campaign[] {
  return backendCampaigns.map(transformBackendCampaign);
}
