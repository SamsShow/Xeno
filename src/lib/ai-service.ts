import { toast } from "sonner";
import { MessageSuggestion, CampaignInsights } from "../types/ai";

// API base URL - in production, this would be an environment variable
const API_BASE_URL = "/api";

export const aiService = {
  /**
   * Generate message suggestions based on campaign objective and details
   */
  getMessageSuggestions: async (
    objective: string,
    audienceDetails?: string,
    productDetails?: string,
    count: number = 3
  ): Promise<MessageSuggestion[]> => {
    try {
      // For demo/development, use mock data when no API is available
      if (
        process.env.NODE_ENV === "development" &&
        window.location.hostname === "localhost"
      ) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        return [
          {
            text: `Hi there! 👋 Ready to re-engage with ${
              audienceDetails || "our latest products"
            }? Tap for an exclusive 15% discount on your next purchase.`,
            tone: "Friendly",
            imagePrompt:
              "Smiling customer holding a shopping bag with the company logo",
          },
          {
            text: `We miss you! Come back today and enjoy a special reward - 20% off any item from our ${
              productDetails || "premium collection"
            }.`,
            tone: "Warm",
            imagePrompt:
              "Elegant gift box with a ribbon, slightly open with a glow coming from inside",
          },
          {
            text: `LIMITED TIME: Haven't shopped with us lately? Your special 25% discount code expires in 48 hours! Shop now.`,
            tone: "Urgent",
            imagePrompt:
              "Countdown timer with shopping items fading away as time runs out",
          },
        ];
      }

      // Real API implementation
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/ai/message-suggestions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          objective,
          audienceDetails,
          productDetails,
          count,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to generate message suggestions"
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error getting message suggestions:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate message suggestions"
      );
      return [];
    }
  },

  /**
   * Generate campaign insights based on performance data
   */
  getCampaignInsights: async (
    campaignName: string,
    objective: string,
    audienceSize: number,
    messagesSent: number,
    messagesDelivered: number,
    audienceSegments: Record<string, { count: number; delivered: number }>
  ): Promise<CampaignInsights | null> => {
    try {
      // For demo/development, use mock data when no API is available
      if (
        process.env.NODE_ENV === "development" &&
        window.location.hostname === "localhost"
      ) {
        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Calculate overall delivery rate
        const deliveryRate = Math.round(
          (messagesDelivered / messagesSent) * 100
        );

        // Find best and worst segments
        const segmentRates: Record<string, number> = {};

        Object.entries(audienceSegments).forEach(([segment, data]) => {
          segmentRates[segment] = Math.round(
            (data.delivered / data.count) * 100
          );
        });

        const segments = Object.keys(segmentRates);
        const bestSegment =
          segments.length > 0
            ? segments.reduce((a, b) =>
                segmentRates[a] > segmentRates[b] ? a : b
              )
            : null;

        const worstSegment =
          segments.length > 0
            ? segments.reduce((a, b) =>
                segmentRates[a] < segmentRates[b] ? a : b
              )
            : null;

        return {
          summary: `Your campaign "${campaignName}" reached ${audienceSize} customers with a delivery rate of ${deliveryRate}%. Out of ${messagesSent} messages sent, ${messagesDelivered} were successfully delivered. ${
            bestSegment
              ? `The ${bestSegment} segment performed best with a ${segmentRates[bestSegment]}% delivery rate.`
              : ""
          } ${
            worstSegment && worstSegment !== bestSegment
              ? `The ${worstSegment} segment had the lowest delivery at ${segmentRates[worstSegment]}%.`
              : ""
          }`,
          recommendations: [
            `Focus more resources on the high-performing ${
              bestSegment || "segments"
            } to maximize ROI.`,
            `Consider re-engaging the ${
              worstSegment || "lower-performing segments"
            } with a different messaging approach.`,
            `Schedule your next campaign during peak engagement hours to improve overall delivery rates.`,
          ],
        };
      }

      // Real API implementation
      const token = localStorage.getItem("auth_token");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${API_BASE_URL}/ai/campaign-insights`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          campaignName,
          objective,
          audienceSize,
          messagesSent,
          messagesDelivered,
          audienceSegments,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || "Failed to generate campaign insights"
        );
      }

      const data = await response.json();
      return data.data;
    } catch (error) {
      console.error("Error getting campaign insights:", error);
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to generate campaign insights"
      );
      return null;
    }
  },
};
