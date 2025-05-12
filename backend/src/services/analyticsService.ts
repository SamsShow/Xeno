import { Op } from "sequelize";
import Customer from "../models/Customer";
import Order from "../models/Order";
import Communication from "../models/Communication";
import { aiService } from "./aiService";

interface CustomerMetrics {
  totalOrders: number;
  totalSpent: number;
  averageOrderValue: number;
  lastOrderDate: Date | null;
  daysSinceLastOrder: number;
  communicationCount: number;
  responseRate: number;
}

interface PredictiveMetrics {
  customerLifetimeValue: number;
  churnProbability: number;
  nextPurchaseProbability: number;
  recommendedActions: string[];
}

export class AnalyticsService {
  async getCustomerMetrics(customerId: string): Promise<CustomerMetrics> {
    const customer = await Customer.findByPk(customerId);
    if (!customer) throw new Error("Customer not found");

    const orders = await Order.findAll({
      where: { customerId },
      order: [["createdAt", "DESC"]],
    });

    const communications = await Communication.findAll({
      where: { customerId },
    });

    const totalOrders = orders.length;
    const totalSpent = orders.reduce(
      (sum, order) => sum + (order.totalAmount || 0),
      0
    );
    const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;
    const lastOrderDate = orders[0]?.createdAt || null;
    const daysSinceLastOrder = lastOrderDate
      ? Math.floor(
          (Date.now() - new Date(lastOrderDate).getTime()) /
            (1000 * 60 * 60 * 24)
        )
      : 0;

    const communicationCount = communications.length;
    const responseRate =
      communications.length > 0
        ? communications.filter(
            (c) => c.status === "opened" || c.status === "clicked"
          ).length / communications.length
        : 0;

    return {
      totalOrders,
      totalSpent,
      averageOrderValue,
      lastOrderDate,
      daysSinceLastOrder,
      communicationCount,
      responseRate,
    };
  }

  async getPredictiveAnalytics(customerId: string): Promise<PredictiveMetrics> {
    const metrics = await this.getCustomerMetrics(customerId);
    const customer = await Customer.findByPk(customerId);

    if (!customer) throw new Error("Customer not found");

    // Prepare data for AI analysis
    const analysisData = {
      customerMetrics: metrics,
      customerData: {
        firstName: customer.firstName,
        lastName: customer.lastName,
        email: customer.email,
        company: customer.company,
        jobTitle: customer.jobTitle,
        createdAt: customer.createdAt,
      },
    };

    // Use Gemini AI to generate predictive analytics
    const predictions = await aiService.generatePredictiveAnalytics(
      analysisData
    );

    return {
      customerLifetimeValue: predictions.customerLifetimeValue,
      churnProbability: predictions.churnProbability,
      nextPurchaseProbability: predictions.nextPurchaseProbability,
      recommendedActions: predictions.recommendedActions,
    };
  }

  async getAggregateMetrics(): Promise<any> {
    const totalCustomers = await Customer.count();
    const totalOrders = await Order.count();
    const totalRevenue = await Order.sum("totalAmount");
    const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

    // Get metrics for the last 30 days
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentOrders = await Order.count({
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    const recentRevenue = await Order.sum("totalAmount", {
      where: {
        createdAt: {
          [Op.gte]: thirtyDaysAgo,
        },
      },
    });

    return {
      totalCustomers,
      totalOrders,
      totalRevenue,
      averageOrderValue,
      recentOrders,
      recentRevenue,
      averageOrderValue30Days:
        recentOrders > 0 ? recentRevenue / recentOrders : 0,
    };
  }
}

export default new AnalyticsService();
