import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Users, ShoppingCart, DollarSign, MessageSquare } from "lucide-react";

interface CustomerMetricsProps {
  data: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    lastOrderDate: Date | null;
    daysSinceLastOrder: number;
    communicationCount: number;
    responseRate: number;
  } | null;
}

export function CustomerMetrics({ data }: CustomerMetricsProps) {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value || 0);
  };

  const formatDate = (date: Date | null) => {
    if (!date) return "No orders yet";
    return new Date(date).toLocaleDateString();
  };

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-muted-foreground">No data available</p>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Orders */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
          <ShoppingCart className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.totalOrders}</div>
          <p className="text-xs text-muted-foreground">
            Last order: {formatDate(data.lastOrderDate)}
          </p>
        </CardContent>
      </Card>

      {/* Total Spent */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Spent</CardTitle>
          <DollarSign className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {formatCurrency(data.totalSpent)}
          </div>
          <p className="text-xs text-muted-foreground">
            Avg. order: {formatCurrency(data.averageOrderValue)}
          </p>
        </CardContent>
      </Card>

      {/* Communication Stats */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Communications</CardTitle>
          <MessageSquare className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.communicationCount}</div>
          <div className="mt-2">
            <div className="flex items-center justify-between text-xs">
              <span>Response Rate</span>
              <span>{(data.responseRate * 100).toFixed(1)}%</span>
            </div>
            <Progress value={data.responseRate * 100} className="h-2 mt-1" />
          </div>
        </CardContent>
      </Card>

      {/* Days Since Last Order */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Last Activity</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.daysSinceLastOrder}</div>
          <p className="text-xs text-muted-foreground">Days since last order</p>
        </CardContent>
      </Card>
    </div>
  );
}
