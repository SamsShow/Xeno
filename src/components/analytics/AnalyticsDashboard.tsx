import React, { useEffect, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CustomerMetrics } from "./CustomerMetrics";
import { PredictiveAnalytics } from "./PredictiveAnalytics";
import { AggregateMetrics } from "./AggregateMetrics";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { httpService } from "@/lib/http-service";

export function AnalyticsDashboard() {
  const { user, token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [customerMetrics, setCustomerMetrics] = useState<any>(null);
  const [predictiveData, setPredictiveData] = useState<any>(null);
  const [aggregateData, setAggregateData] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Fetch aggregate metrics first
        const aggregateData = await httpService.get("/api/analytics/aggregate");
        setAggregateData(aggregateData);

        // Only fetch customer-specific data if we have a user
        if (user?.id) {
          // Fetch customer metrics
          const customerData = await httpService.get(
            `/api/analytics/customer-metrics?customerId=${user.id}`
          );
          setCustomerMetrics(customerData);

          // Fetch predictive analytics
          const predictiveData = await httpService.get(
            `/api/analytics/predictive?customerId=${user.id}`
          );
          setPredictiveData(predictiveData);
        }
      } catch (error) {
        console.error("Error fetching analytics data:", error);
        toast.error("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, user?.id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">
          Analytics Dashboard
        </h2>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="customers">Customer Analytics</TabsTrigger>
          <TabsTrigger value="predictive">Predictive Insights</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <AggregateMetrics data={aggregateData} />
        </TabsContent>

        <TabsContent value="customers" className="space-y-4">
          {user?.id ? (
            <CustomerMetrics data={customerMetrics} />
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground">
                Please log in to view customer analytics
              </p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="predictive" className="space-y-4">
          {user?.id ? (
            <PredictiveAnalytics data={predictiveData} />
          ) : (
            <div className="flex items-center justify-center min-h-[400px]">
              <p className="text-muted-foreground">
                Please log in to view predictive insights
              </p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
 