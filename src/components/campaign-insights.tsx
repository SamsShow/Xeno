import React, { useState, useEffect } from "react";
import { CampaignInsights } from "../types/ai";
import { aiService } from "../lib/ai-service";

interface CampaignInsightsProps {
  campaignName: string;
  objective: string;
  audienceSize: number;
  messagesSent: number;
  messagesDelivered: number;
  audienceSegments: Record<string, { count: number; delivered: number }>;
}

export const CampaignInsightsPanel: React.FC<CampaignInsightsProps> = ({
  campaignName,
  objective,
  audienceSize,
  messagesSent,
  messagesDelivered,
  audienceSegments,
}) => {
  const [insights, setInsights] = useState<CampaignInsights | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInsights = async () => {
      if (!campaignName || !audienceSize || messagesSent === 0) return;

      setLoading(true);
      setError(null);

      try {
        const data = await aiService.getCampaignInsights(
          campaignName,
          objective,
          audienceSize,
          messagesSent,
          messagesDelivered,
          audienceSegments
        );

        setInsights(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to generate insights"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchInsights();
  }, [
    campaignName,
    objective,
    audienceSize,
    messagesSent,
    messagesDelivered,
    audienceSegments,
  ]);

  const handleRegenerateClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await aiService.getCampaignInsights(
        campaignName,
        objective,
        audienceSize,
        messagesSent,
        messagesDelivered,
        audienceSegments
      );

      setInsights(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to regenerate insights"
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading && !insights) {
    return (
      <div className="bg-white rounded-lg shadow p-6 animate-pulse">
        <div className="h-5 w-48 bg-gray-200 rounded mb-6"></div>
        <div className="h-24 bg-gray-200 rounded mb-6"></div>
        <div className="h-4 w-full bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-4/5 bg-gray-200 rounded mb-2"></div>
        <div className="h-4 w-3/5 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="flex justify-between items-center border-b p-4">
        <h3 className="text-lg font-medium text-gray-800">Campaign Insights</h3>

        <button
          onClick={handleRegenerateClick}
          disabled={loading}
          className="text-sm flex items-center px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
        >
          {loading ? (
            <>
              <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></span>
              Analyzing...
            </>
          ) : (
            <>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                />
              </svg>
              Refresh Analysis
            </>
          )}
        </button>
      </div>

      {error && (
        <div className="p-4">
          <div className="text-red-500 text-sm px-4 py-2 bg-red-50 rounded">
            {error}
          </div>
        </div>
      )}

      <div className="p-4">
        {insights ? (
          <>
            <div className="mb-6">
              <div className="flex mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-blue-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="text-sm font-medium text-gray-700">Summary</h4>
              </div>
              <p className="text-gray-700">{insights.summary}</p>
            </div>

            <div>
              <div className="flex mb-2">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h4 className="text-sm font-medium text-gray-700">
                  Recommendations
                </h4>
              </div>

              <ul className="space-y-2 text-gray-700">
                {insights.recommendations.map((recommendation, i) => (
                  <li key={i} className="flex">
                    <span className="text-green-500 mr-2">•</span>
                    <span>{recommendation}</span>
                  </li>
                ))}
              </ul>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-10 w-10 text-gray-300 mb-3"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <p className="text-gray-500">
              Your campaign insights will appear here once the campaign has been
              sent.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
