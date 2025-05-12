import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  AlertCircle,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
} from "lucide-react";

interface PredictiveAnalyticsProps {
  data: {
    nextPurchasePrediction: {
      probability: number;
      estimatedDate: Date;
      confidence: number;
    };
    churnRisk: {
      risk: number;
      factors: string[];
    };
    revenueForecast: {
      nextMonth: number;
      nextQuarter: number;
      nextYear: number;
      growthRate: number;
    };
    customerSegmentation: {
      segments: Array<{
        name: string;
        size: number;
        value: number;
        growth: number;
      }>;
    };
  };
}

export function PredictiveAnalytics({ data }: PredictiveAnalyticsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatPercentage = (value: number) => {
    return `${(value * 100).toFixed(1)}%`;
  };

  return (
    <div className="space-y-6">
      {/* Next Purchase Prediction */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Next Purchase Prediction
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-3">
            <div>
              <p className="text-sm font-medium">Probability</p>
              <p className="text-2xl font-bold">
                {formatPercentage(data.nextPurchasePrediction.probability)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Estimated Date</p>
              <p className="text-2xl font-bold">
                {formatDate(data.nextPurchasePrediction.estimatedDate)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Confidence</p>
              <p className="text-2xl font-bold">
                {formatPercentage(data.nextPurchasePrediction.confidence)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Churn Risk */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5" />
            Churn Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium">Risk Level</p>
              <p className="text-2xl font-bold">
                {formatPercentage(data.churnRisk.risk)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium mb-2">Risk Factors</p>
              <ul className="list-disc list-inside space-y-1">
                {data.churnRisk.factors.map((factor, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {factor}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Revenue Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Revenue Forecast
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-4">
            <div>
              <p className="text-sm font-medium">Next Month</p>
              <p className="text-2xl font-bold">
                {formatCurrency(data.revenueForecast.nextMonth)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Next Quarter</p>
              <p className="text-2xl font-bold">
                {formatCurrency(data.revenueForecast.nextQuarter)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Next Year</p>
              <p className="text-2xl font-bold">
                {formatCurrency(data.revenueForecast.nextYear)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium">Growth Rate</p>
              <p className="text-2xl font-bold">
                {formatPercentage(data.revenueForecast.growthRate)}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Customer Segmentation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Customer Segmentation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data.customerSegmentation.segments.map((segment, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{segment.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {segment.size} customers
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium">{formatCurrency(segment.value)}</p>
                  <p
                    className={`text-sm ${
                      segment.growth >= 0 ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {segment.growth >= 0 ? "+" : ""}
                    {formatPercentage(segment.growth)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
