import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Customer from "./Customer";

interface CampaignAttributes {
  id?: string;
  name: string;
  description?: string;
  objective: string;
  status: "draft" | "scheduled" | "active" | "completed" | "cancelled";
  channel: "email" | "sms" | "push" | "social" | "other";
  scheduledDate?: Date;
  sentDate?: Date;
  content: string;
  targetAudience?: string;
  metrics?: {
    sent?: number;
    delivered?: number;
    opened?: number;
    clicked?: number;
    converted?: number;
  };
  tags?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

class Campaign extends Model<CampaignAttributes> implements CampaignAttributes {
  public id!: string;
  public name!: string;
  public description!: string;
  public objective!: string;
  public status!: "draft" | "scheduled" | "active" | "completed" | "cancelled";
  public channel!: "email" | "sms" | "push" | "social" | "other";
  public scheduledDate?: Date;
  public sentDate?: Date;
  public content!: string;
  public targetAudience?: string;
  public metrics?: {
    sent?: number;
    delivered?: number;
    opened?: number;
    clicked?: number;
    converted?: number;
  };
  public tags?: string[];
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getCustomers!: () => Promise<Customer[]>;
  public addCustomers!: (
    customers: Customer | Customer[] | string | string[]
  ) => Promise<void>;
  public setCustomers!: (
    customers: Customer | Customer[] | string | string[]
  ) => Promise<void>;
  public removeCustomers!: (
    customers: Customer | Customer[] | string | string[]
  ) => Promise<void>;
  public countCustomers!: () => Promise<number>;
  public hasCustomers!: (customer: Customer | string) => Promise<boolean>;
}

Campaign.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    objective: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "draft",
        "scheduled",
        "active",
        "completed",
        "cancelled"
      ),
      defaultValue: "draft",
      allowNull: false,
    },
    channel: {
      type: DataTypes.ENUM("email", "sms", "push", "social", "other"),
      allowNull: false,
    },
    scheduledDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    sentDate: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    targetAudience: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    metrics: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: {
        sent: 0,
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
      },
    },
    tags: {
      type: DataTypes.JSON,
      allowNull: true,
      defaultValue: [],
    },
  },
  {
    sequelize,
    tableName: "campaigns",
    timestamps: true,
  }
);

// Define a many-to-many relationship between campaigns and customers
Campaign.belongsToMany(Customer, {
  through: "campaign_customers",
  foreignKey: "campaignId",
  otherKey: "customerId",
  as: "customers",
});

Customer.belongsToMany(Campaign, {
  through: "campaign_customers",
  foreignKey: "customerId",
  otherKey: "campaignId",
  as: "campaigns",
});

export default Campaign;
