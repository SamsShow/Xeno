import {
  GoogleGenerativeAI,
  HarmBlockThreshold,
  HarmCategory,
} from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

// Get API key from environment variables
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

// Initialize the Google Generative AI
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || "");

// Get the model
const model = genAI.getGenerativeModel({
  model: "gemini-pro",
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_HATE_SPEECH,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
    {
      category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT,
      threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE,
    },
  ],
});

// Interface for message suggestion response
export interface MessageSuggestion {
  text: string;
  tone: string;
  imagePrompt?: string;
}

// Interface for campaign insights
export interface CampaignInsights {
  summary: string;
  recommendations: string[];
}

export const aiService = {
  /**
   * Generate message suggestions based on campaign objective, audience, and product details
   */
  generateMessageSuggestions: async (
    objective: string,
    audienceDetails: string,
    productDetails: string,
    count: number = 3
  ): Promise<MessageSuggestion[]> => {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not found");
      }

      const prompt = `You are an expert marketing copywriter. Generate ${count} different message variants for a marketing campaign with the following details:
      
Campaign Objective: ${objective}
Target Audience: ${audienceDetails}
Product/Service Details: ${productDetails}

For each message variant:
1. Make it concise (under 160 characters) and engaging
2. Focus on a clear call to action
3. Include personalization elements where appropriate
4. Specify the tone (friendly, professional, urgent, etc.)
5. Suggest a description of a relevant image that would complement the message

Format the response as JSON with an array of message objects, each having: text, tone, and imagePrompt properties.
Only return valid JSON without any additional explanation. The structure should be exactly:
[
  {
    "text": "Message text here",
    "tone": "Tone of this message",
    "imagePrompt": "Description of a complementary image"
  }
]`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      try {
        // Extract JSON from the response
        const jsonMatch = text.match(/(\[[\s\S]*\])/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;
        const suggestions = JSON.parse(jsonString) as MessageSuggestion[];

        return suggestions.slice(0, count);
      } catch (error) {
        console.error("Error parsing AI response:", error);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Error generating message suggestions:", error);
      throw error;
    }
  },

  /**
   * Generate campaign performance insights
   */
  generateCampaignInsights: async (
    campaignName: string,
    objective: string,
    audienceSize: number,
    messagesSent: number,
    messagesDelivered: number,
    audienceSegments: Record<string, { count: number; delivered: number }>
  ): Promise<CampaignInsights> => {
    try {
      if (!GEMINI_API_KEY) {
        throw new Error("Gemini API key not found");
      }

      // Create segments description
      const segmentsDescription = Object.entries(audienceSegments)
        .map(([segment, data]) => {
          const deliveryRate = ((data.delivered / data.count) * 100).toFixed(1);
          return `- ${segment}: ${data.count} contacts, ${data.delivered} delivered (${deliveryRate}% delivery rate)`;
        })
        .join("\\n");

      const overallDeliveryRate = (
        (messagesDelivered / messagesSent) *
        100
      ).toFixed(1);

      const prompt = `You are a CRM analytics expert. Generate a human-readable insight summary for the following campaign performance data:
      
Campaign Name: ${campaignName}
Campaign Objective: ${objective}
Audience Size: ${audienceSize}
Messages Sent: ${messagesSent}
Messages Delivered: ${messagesDelivered}
Overall Delivery Rate: ${overallDeliveryRate}%

Audience Segments Performance:
${segmentsDescription}

Provide insights in the following format:
1. A concise summary paragraph that highlights key metrics in a conversational tone (150 words max).
2. An array of 2-3 actionable recommendations based on the performance data.

Format the response as JSON with: summary and recommendations properties.
Only return valid JSON without any additional explanation. The structure should be exactly:
{
  "summary": "Summary text here",
  "recommendations": ["Recommendation 1", "Recommendation 2", "Recommendation 3"]
}`;

      const result = await model.generateContent(prompt);
      const response = result.response;
      const text = response.text();

      try {
        // Extract JSON from the response
        const jsonMatch = text.match(/(\{[\s\S]*\})/);
        const jsonString = jsonMatch ? jsonMatch[0] : text;
        const insights = JSON.parse(jsonString) as CampaignInsights;

        return insights;
      } catch (error) {
        console.error("Error parsing AI response:", error);
        throw new Error("Failed to parse AI response");
      }
    } catch (error) {
      console.error("Error generating campaign insights:", error);
      throw error;
    }
  },
};
