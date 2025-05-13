import React, { useEffect, useState } from "react";
import { campaignService } from "../services/campaignService";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Loader2 } from "lucide-react";

interface CampaignDeliveryInfoProps {
  campaignId: string;
}

export function CampaignDeliveryInfo({
  campaignId,
}: CampaignDeliveryInfoProps) {
  const [deliveryInfo, setDeliveryInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDeliveryInfo = async () => {
      try {
        setLoading(true);
        const info = await campaignService.getDeliveryInfo(campaignId);
        setDeliveryInfo(info);
        setError(null);
      } catch (err) {
        console.error("Error fetching delivery info:", err);
        setError("Failed to load delivery information");
      } finally {
        setLoading(false);
      }
    };

    // Fetch delivery info immediately
    fetchDeliveryInfo();

    // Then set up polling every 10 seconds
    const interval = setInterval(fetchDeliveryInfo, 10000);

    return () => clearInterval(interval);
  }, [campaignId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="flex justify-center items-center py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6 text-red-500">{error}</div>
        </CardContent>
      </Card>
    );
  }

  // If no messages have been sent yet
  if (!deliveryInfo || deliveryInfo.sent === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-medium">
            Delivery Information
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center py-6">
          <h3 className="text-lg font-medium text-gray-600">
            No messages sent yet
          </h3>
          <p className="text-gray-500">
            Delivery information will appear here once messages are sent.
          </p>
        </CardContent>
      </Card>
    );
  }

  const totalSent = deliveryInfo.sent || 0;
  const deliveryRate =
    totalSent > 0 ? Math.round((deliveryInfo.delivered / totalSent) * 100) : 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium">
          Delivery Information
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Sent</p>
              <p className="text-2xl font-bold">{deliveryInfo.sent}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Delivered</p>
              <p className="text-2xl font-bold">{deliveryInfo.delivered}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Failed</p>
              <p className="text-2xl font-bold text-red-600">
                {deliveryInfo.failed}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {deliveryInfo.pending}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Delivery Rate</span>
              <span className="font-medium">{deliveryRate}%</span>
            </div>
            <Progress value={deliveryRate} className="h-2" />
          </div>

          <div className="text-sm text-muted-foreground">
            Last updated:{" "}
            {new Date(deliveryInfo.details?.lastUpdated).toLocaleString()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
