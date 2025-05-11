import { Campaign, RuleGroup } from "../types/campaign";
import { calculateAudienceSize, generateId } from "./utils";
import { communicationService } from "./communication-service";
import { aiService } from "./ai-service";
import { CampaignInsights } from "../types/ai";

// Mock data for campaigns
const MOCK_CAMPAIGNS: Campaign[] = [
  {
    id: "camp-1",
    name: "Summer Sale 2023",
    description: "Target high spenders for summer promotion",
    rules: {
      id: "1",
      operator: "AND",
      conditions: [
        {
          id: "cond-1",
          field: "spend",
          operator: "greaterThan",
          value: 10000,
        },
        {
          id: "rule-2",
          operator: "OR",
          conditions: [
            {
              id: "cond-2",
              field: "visits",
              operator: "greaterThan",
              value: 5,
            },
            {
              id: "cond-3",
              field: "lastActive",
              operator: "inactiveFor",
              value: 30,
            },
          ],
        },
      ],
    },
    audienceSize: 2450,
    createdAt: "2023-06-15T10:30:00Z",
    stats: {
      sent: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
    },
    status: "draft",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "camp-2",
    name: "Win-back Campaign",
    description: "Re-engage inactive customers",
    rules: {
      id: "2",
      operator: "AND",
      conditions: [
        {
          id: "cond-4",
          field: "lastActive",
          operator: "inactiveFor",
          value: 90,
        },
        {
          id: "cond-5",
          field: "spend",
          operator: "lessThan",
          value: 1000,
        },
      ],
    },
    audienceSize: 5670,
    createdAt: "2023-09-05T14:20:00Z",
    stats: {
      sent: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
    },
    status: "draft",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "camp-3",
    name: "New Product Launch",
    description: "Promote a new product to potential customers",
    rules: {
      id: "3",
      operator: "AND",
      conditions: [
        {
          id: "cond-6",
          field: "lastActive",
          operator: "inactiveFor",
          value: 30,
        },
        {
          id: "cond-7",
          field: "spend",
          operator: "lessThan",
          value: 500,
        },
      ],
    },
    audienceSize: 3450,
    createdAt: "2023-07-20T12:00:00Z",
    stats: {
      sent: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
    },
    status: "draft",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "camp-4",
    name: "Email Newsletter",
    description: "Send a monthly email newsletter to subscribers",
    rules: {
      id: "4",
      operator: "AND",
      conditions: [
        {
          id: "cond-8",
          field: "lastActive",
          operator: "inactiveFor",
          value: 60,
        },
        {
          id: "cond-9",
          field: "spend",
          operator: "lessThan",
          value: 100,
        },
      ],
    },
    audienceSize: 10000,
    createdAt: "2023-08-01T10:00:00Z",
    stats: {
      sent: 0,
      delivered: 0,
      failed: 0,
      pending: 0,
    },
    status: "draft",
    updatedAt: new Date().toISOString(),
  },
];

// In-memory store for campaigns
let campaigns = [...MOCK_CAMPAIGNS];

export const campaignService = {
  // Get all campaigns sorted by creation date (newest first)
  getCampaigns: (): Campaign[] => {
    return [...campaigns].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  },

  // Get a single campaign by ID
  getCampaign: (id: string): Campaign | undefined => {
    return campaigns.find((campaign) => campaign.id === id);
  },

  // Create a new campaign
  createCampaign: (
    name: string,
    description: string,
    rules: RuleGroup
  ): Campaign => {
    const audienceSize = calculateAudienceSize(rules);

    const newCampaign: Campaign = {
      id: generateId(),
      name,
      description,
      rules,
      audienceSize,
      createdAt: new Date().toISOString(),
      stats: {
        sent: 0,
        delivered: 0,
        failed: 0,
        pending: 0,
      },
      status: "draft",
      updatedAt: new Date().toISOString(),
    };

    campaigns.push(newCampaign);
    return newCampaign;
  },

  // Calculate audience size for a rule (would be an API call in real app)
  calculateAudienceSize: (rules: RuleGroup): number => {
    return calculateAudienceSize(rules);
  },

  // Deliver a campaign to its audience
  deliverCampaign: async (campaignId: string): Promise<void> => {
    const campaign = campaignService.getCampaign(campaignId);
    if (!campaign) {
      throw new Error(`Campaign with ID ${campaignId} not found`);
    }

    await communicationService.initiateCampaignDelivery(campaign);
  },

  // Update campaign statistics based on delivery results
  updateCampaignStats: (campaignId: string): void => {
    const campaign = campaignService.getCampaign(campaignId);
    if (!campaign) return;

    const { stats } = communicationService.getDeliveryStats(campaignId);

    // Find the campaign index
    const campaignIndex = campaigns.findIndex((c) => c.id === campaignId);
    if (campaignIndex !== -1) {
      campaigns[campaignIndex] = {
        ...campaigns[campaignIndex],
        stats: {
          sent: stats.sent,
          delivered: stats.delivered,
          failed: stats.failed,
          pending: stats.pending,
        },
      };
    }
  },

  getInsights: async (campaignId: string): Promise<CampaignInsights | null> => {
    const campaign = campaignService.getCampaign(campaignId);

    if (!campaign) {
      return null;
    }

    // Get communication logs for this campaign
    const logs = communicationService.getCommunicationLogs(campaignId);

    if (logs.length === 0) {
      return null;
    }

    // Calculate metrics
    const messagesSent = logs.length;
    const messagesDelivered = logs.filter(
      (log) => log.status === "SENT"
    ).length;

    // Create audience segments for analysis
    // In a real app, this would be based on user attributes
    // For this demo, we'll create fictional segments
    const audienceSegments: Record<
      string,
      { count: number; delivered: number }
    > = {
      "High-value customers": {
        count: Math.floor(messagesSent * 0.25),
        delivered: Math.floor(messagesDelivered * 0.3),
      },
      "New customers": {
        count: Math.floor(messagesSent * 0.4),
        delivered: Math.floor(messagesDelivered * 0.35),
      },
      "Inactive users": {
        count: Math.floor(messagesSent * 0.35),
        delivered: Math.floor(messagesDelivered * 0.35),
      },
    };

    // Generate insights using AI
    return aiService.getCampaignInsights(
      campaign.name,
      campaign.objective || "General marketing",
      campaign.audienceSize,
      messagesSent,
      messagesDelivered,
      audienceSegments
    );
  },
};
