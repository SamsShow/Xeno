import React, { useState, useEffect } from "react";
import { MessageSuggestion } from "../types/ai";
import { aiService } from "../lib/ai-service";

interface MessageSuggestionsProps {
  objective: string;
  audienceDetails?: string;
  productDetails?: string;
  onSelectMessage?: (message: string) => void;
}

export const MessageSuggestions: React.FC<MessageSuggestionsProps> = ({
  objective,
  audienceDetails,
  productDetails,
  onSelectMessage,
}) => {
  const [suggestions, setSuggestions] = useState<MessageSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [showImagePrompts, setShowImagePrompts] = useState(false);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!objective) return;

      setLoading(true);
      setError(null);

      try {
        const data = await aiService.getMessageSuggestions(
          objective,
          audienceDetails,
          productDetails
        );

        setSuggestions(data);
        setSelectedIndex(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load suggestions"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchSuggestions();
  }, [objective, audienceDetails, productDetails]);

  const handleSelectMessage = (index: number) => {
    setSelectedIndex(index);
    if (onSelectMessage && suggestions[index]) {
      onSelectMessage(suggestions[index].text);
    }
  };

  const handleRegenerateClick = async () => {
    setLoading(true);
    setError(null);

    try {
      const data = await aiService.getMessageSuggestions(
        objective,
        audienceDetails,
        productDetails
      );

      setSuggestions(data);
      setSelectedIndex(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to regenerate suggestions"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">
          AI-Generated Message Suggestions
        </h3>

        <div className="flex gap-2">
          <button
            onClick={() => setShowImagePrompts(!showImagePrompts)}
            className="text-sm px-2 py-1 text-gray-600 hover:text-gray-800"
          >
            {showImagePrompts ? "Hide image ideas" : "Show image ideas"}
          </button>

          <button
            onClick={handleRegenerateClick}
            disabled={loading}
            className="text-sm flex items-center px-3 py-1 bg-gray-100 rounded hover:bg-gray-200 disabled:opacity-50"
          >
            {loading ? (
              <>
                <span className="animate-spin h-4 w-4 border-2 border-blue-500 border-t-transparent rounded-full mr-2"></span>
                Generating...
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
                Regenerate
              </>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-500 text-sm px-4 py-2 bg-red-50 rounded">
          {error}
        </div>
      )}

      {loading && suggestions.length === 0 ? (
        <div className="flex justify-center items-center h-48 bg-gray-50 rounded">
          <div className="flex flex-col items-center">
            <div className="animate-spin h-8 w-8 border-3 border-blue-500 border-t-transparent rounded-full mb-3"></div>
            <p className="text-gray-500">Generating message suggestions...</p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={`p-4 border rounded-lg transition-all ${
                selectedIndex === index
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              onClick={() => handleSelectMessage(index)}
            >
              <div className="flex justify-between items-start mb-2">
                <span className="inline-block px-2 py-1 text-xs font-medium bg-gray-100 rounded text-gray-700 mb-2">
                  {suggestion.tone}
                </span>

                {selectedIndex === index && (
                  <span className="text-xs text-green-600 font-medium flex items-center">
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
                        d="M5 13l4 4L19 7"
                      />
                    </svg>
                    Selected
                  </span>
                )}
              </div>

              <p className="text-gray-800">{suggestion.text}</p>

              {showImagePrompts && suggestion.imagePrompt && (
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-start">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-gray-400 mr-2 mt-0.5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <div>
                      <p className="text-xs font-medium text-gray-500 mb-1">
                        Suggested image
                      </p>
                      <p className="text-sm text-gray-600">
                        {suggestion.imagePrompt}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
