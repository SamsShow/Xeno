import { useState, useEffect } from "react";
import { RuleGroup } from "../types/campaign";
import { Button } from "./ui/button";
import { campaignService } from "../lib/campaign-service";
import React from "react";

interface AudiencePreviewProps {
  rules: RuleGroup;
}

export function AudiencePreview({ rules }: AudiencePreviewProps) {
  const [audienceSize, setAudienceSize] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const calculateAudience = () => {
    setIsLoading(true);

    // Simulate API call delay
    setTimeout(() => {
      const size = campaignService.calculateAudienceSize(rules);
      setAudienceSize(size);
      setIsLoading(false);
    }, 600);
  };

  // Calculate audience size when rules change (if we have at least one condition)
  useEffect(() => {
    const hasConditions = rules.conditions.length > 0;

    if (hasConditions) {
      calculateAudience();
    } else {
      setAudienceSize(null);
    }
  }, [rules]);

  if (audienceSize === null) {
    return null;
  }

  return (
    <div className="mt-4 p-4 border rounded-md bg-blue-50 flex items-center justify-between">
      <div>
        <h3 className="font-medium text-blue-800">Audience Preview</h3>
        <p className="text-blue-600">
          {isLoading ? (
            <span className="text-sm">Calculating audience size...</span>
          ) : (
            <span className="text-xl font-semibold">
              {audienceSize.toLocaleString()} users
            </span>
          )}
        </p>
      </div>

      <Button
        variant="outline"
        onClick={calculateAudience}
        disabled={isLoading}
        className="bg-white hover:bg-gray-50"
      >
        Refresh
      </Button>
    </div>
  );
}
