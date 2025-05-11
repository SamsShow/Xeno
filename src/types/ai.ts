// Message suggestion from AI
export interface MessageSuggestion {
  text: string;
  tone: string;
  imagePrompt?: string;
}

// Message suggestion response from API
export interface MessageSuggestionsResponse {
  status: string;
  data: MessageSuggestion[];
}

// Campaign insights from AI
export interface CampaignInsights {
  summary: string;
  recommendations: string[];
}

// Campaign insights response from API
export interface CampaignInsightsResponse {
  status: string;
  data: CampaignInsights;
}
