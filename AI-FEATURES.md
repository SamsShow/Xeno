# AI Features in Xeno

This document outlines the AI-powered features implemented in the Xeno CRM platform, their architecture, and how to use them.

## Overview

Xeno includes two main AI-powered features:

1. **AI-Driven Message Suggestions** - Generate tailored marketing messages based on campaign objectives
2. **Campaign Performance Summarization** - Provide human-readable insights and recommendations from campaign data

Both features use Google's Gemini Pro model to generate natural language content that helps marketers create more effective campaigns and understand their performance.

## Architecture

The AI integration follows a client-server architecture:

```
┌───────────────┐     ┌───────────────┐     ┌───────────────┐
│   Frontend    │─────▶    Backend    │─────▶  Gemini API   │
│  Components   │◀─────│   Services    │◀─────│              │
└───────────────┘     └───────────────┘     └───────────────┘
```

- **Frontend Components**: UI elements that collect inputs and display AI-generated content
- **Backend Services**: API endpoints that process requests, call the Gemini API, and return structured results
- **Gemini API**: Google's generative AI model that creates the content

## 1. AI-Driven Message Suggestions

### How It Works

1. User enters a campaign objective (e.g., "Re-engage inactive users")
2. Optionally, user provides additional context about the audience and product
3. The system generates multiple message variations with different tones and styles
4. Each suggestion includes a complementary image prompt

### Implementation Details

- **Frontend**: `MessageSuggestions` component in `src/components/message-suggestions.tsx`
- **Backend**: `/api/ai/message-suggestions` endpoint in `src/routes/aiRoutes.ts`
- **AI Service**: `generateMessageSuggestions()` in `src/services/aiService.ts`

### Using Message Suggestions

1. When creating a campaign, select a campaign objective from the dropdown
2. Fill in the audience and product details for more targeted suggestions
3. Click "Get AI Suggestions" to generate message variations
4. Click on any suggestion to use it in your campaign
5. Toggle "Show image ideas" to view complementary image recommendations

## 2. Campaign Performance Summarization

### How It Works

1. System collects campaign performance data (sent, delivered, audience segments, etc.)
2. The AI analyzes the data and identifies patterns and insights
3. A human-readable summary is generated with key metrics highlighted
4. Actionable recommendations are provided based on the analysis

### Implementation Details

- **Frontend**: `CampaignInsightsPanel` component in `src/components/campaign-insights.tsx`
- **Backend**: `/api/ai/campaign-insights` endpoint in `src/routes/aiRoutes.ts`
- **AI Service**: `generateCampaignInsights()` in `src/services/aiService.ts`

### Viewing Campaign Insights

1. Navigate to the Campaigns list and select a sent campaign
2. The insights panel will automatically load for completed campaigns
3. View the summary and recommendations
4. Click "Refresh Analysis" to regenerate insights

## Configuration

To configure the AI features, you need to set up your Gemini API key:

1. Obtain a Gemini API key from the [Google AI Studio](https://makersuite.google.com/)
2. Add the key to your `.env` file:
   ```
   GEMINI_API_KEY=your-gemini-api-key
   ```

## Error Handling

Both AI features include proper error handling and fallback mechanisms:

- Graceful degradation if the API is unavailable
- Timeout handling for long-running requests
- Appropriate error messages for user feedback
- Default mock responses for development and testing

## Security Considerations

- API keys are stored securely as environment variables
- All requests to the Gemini API are authenticated
- Content moderation is applied to prevent inappropriate outputs
- User inputs are validated before processing

## Future Enhancements

Planned improvements to the AI features include:

1. A/B testing integration to track the performance of AI-generated messages
2. Personalization variables in message suggestions
3. More detailed audience segmentation analysis
4. Historical trend analysis for campaign performance over time
