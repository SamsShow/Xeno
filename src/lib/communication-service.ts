import {
  DeliveryStatus,
  CommunicationLog,
  Customer,
} from "../types/communication";
import { Campaign } from "../types/campaign";
import { generateId } from "./utils";

// Mock customer data
const MOCK_CUSTOMERS: Customer[] = [
  {
    id: "cust-1",
    name: "Mohit",
    email: "mohit@example.com",
    phone: "+91987654321",
  },
  {
    id: "cust-2",
    name: "Sarah",
    email: "sarah@example.com",
    phone: "+91876543210",
  },
  {
    id: "cust-3",
    name: "Alex",
    email: "alex@example.com",
    phone: "+91765432109",
  },
  {
    id: "cust-4",
    name: "Priya",
    email: "priya@example.com",
    phone: "+91654321098",
  },
  {
    id: "cust-5",
    name: "James",
    email: "james@example.com",
    phone: "+91543210987",
  },
  // Add more mock customers as needed
];

// In-memory store for communication logs
let communicationLogs: CommunicationLog[] = [];

// Simulates batch processing with configurable batch size
const processBatch = async (
  items: any[],
  processFn: (item: any) => Promise<any>,
  batchSize = 5
) => {
  const results = [];
  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(batch.map(processFn));
    results.push(...batchResults);
  }
  return results;
};

// Simulates a vendor API for sending messages
const vendorApi = {
  sendMessage: async (
    customer: Customer,
    message: string
  ): Promise<{ success: boolean; reason?: string }> => {
    // Simulate API delay
    await new Promise((resolve) =>
      setTimeout(resolve, 300 + Math.random() * 700)
    );

    // Simulate ~90% success rate
    const isSuccess = Math.random() < 0.9;

    if (isSuccess) {
      return { success: true };
    } else {
      return {
        success: false,
        reason: ["network error", "invalid number", "service unavailable"][
          Math.floor(Math.random() * 3)
        ],
      };
    }
  },
};

export const communicationService = {
  // Get communication logs for a campaign
  getCommunicationLogs: (campaignId: string): CommunicationLog[] => {
    return communicationLogs.filter((log) => log.campaignId === campaignId);
  },

  // Get all customers (in a real app, this would filter based on campaign rules)
  getCustomersForCampaign: (campaign: Campaign): Customer[] => {
    // In a real app, this would use the campaign rules to filter customers
    // For this demo, we'll just return a subset of customers based on audience size
    const count = Math.min(campaign.audienceSize, MOCK_CUSTOMERS.length);
    return MOCK_CUSTOMERS.slice(0, count);
  },

  // Create personalized message for a customer
  createPersonalizedMessage: (
    customer: Customer,
    campaign: Campaign
  ): string => {
    return `Hi ${customer.name}, here's 10% off on your next order!`;
  },

  // Initiate campaign delivery
  initiateCampaignDelivery: async (campaign: Campaign): Promise<void> => {
    const customers = communicationService.getCustomersForCampaign(campaign);

    // Create communication logs with PENDING status
    const logs: CommunicationLog[] = customers.map((customer) => ({
      id: generateId(),
      campaignId: campaign.id,
      customerId: customer.id,
      message: communicationService.createPersonalizedMessage(
        customer,
        campaign
      ),
      status: "PENDING" as DeliveryStatus,
      sentAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }));

    // Add logs to in-memory store
    communicationLogs.push(...logs);

    // Process delivery in batches
    processBatch(
      logs,
      async (log) => {
        const customer = MOCK_CUSTOMERS.find((c) => c.id === log.customerId);
        if (!customer) return;

        const result = await vendorApi.sendMessage(customer, log.message);

        // Simulate delivery receipt callback
        await communicationService.updateDeliveryStatus(
          log.id,
          result.success ? "SENT" : "FAILED",
          result.reason
        );
      },
      5
    );
  },

  // Update delivery status (called by delivery receipt API)
  updateDeliveryStatus: async (
    logId: string,
    status: DeliveryStatus,
    failureReason?: string
  ): Promise<CommunicationLog | undefined> => {
    const logIndex = communicationLogs.findIndex((log) => log.id === logId);

    if (logIndex === -1) return undefined;

    // Update the log
    communicationLogs[logIndex] = {
      ...communicationLogs[logIndex],
      status,
      updatedAt: new Date().toISOString(),
      failureReason,
    };

    // Update campaign stats in a real app, this would be a transaction
    const campaignId = communicationLogs[logIndex].campaignId;

    // In a real app, this would make DB updates in batches
    // For simplicity, we'll update campaign stats directly
    import("../services/campaignService").then((module) => {
      module.campaignService.updateCampaignStats(campaignId, {
        sent: communicationService
          .getCommunicationLogs(campaignId)
          .filter((log) => log.status === "SENT").length,
        delivered: communicationService
          .getCommunicationLogs(campaignId)
          .filter((log) => log.status === "SENT").length, // In a real app these would be different
        failed: communicationService
          .getCommunicationLogs(campaignId)
          .filter((log) => log.status === "FAILED").length,
        pending: communicationService
          .getCommunicationLogs(campaignId)
          .filter((log) => log.status === "PENDING").length,
      });
    });

    return communicationLogs[logIndex];
  },

  // Get delivery stats for a campaign
  getDeliveryStats: (campaignId: string) => {
    const logs = communicationService.getCommunicationLogs(campaignId);
    const sent = logs.filter((log) => log.status === "SENT").length;
    const failed = logs.filter((log) => log.status === "FAILED").length;
    const pending = logs.filter((log) => log.status === "PENDING").length;

    const stats = {
      sent,
      failed,
      pending,
      delivered: 0,
    };

    return {
      stats: {
        sent: stats.sent,
        delivered: stats.delivered || 0,
        failed: stats.failed,
        pending: stats.pending,
      },
    };
  },
};
