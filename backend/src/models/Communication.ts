import { Model, DataTypes } from "sequelize";
import sequelize from "../config/database";
import Customer from "./Customer";
import Campaign from "./Campaign";

interface CommunicationAttributes {
  id?: string;
  type: "email" | "sms" | "push" | "social" | "other";
  status: "pending" | "sent" | "delivered" | "failed" | "opened" | "clicked";
  content: string;
  subject?: string;
  metadata?: any;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  clickedAt?: Date;
  customerId: string;
  campaignId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

class Communication
  extends Model<CommunicationAttributes>
  implements CommunicationAttributes
{
  public id!: string;
  public type!: "email" | "sms" | "push" | "social" | "other";
  public status!:
    | "pending"
    | "sent"
    | "delivered"
    | "failed"
    | "opened"
    | "clicked";
  public content!: string;
  public subject?: string;
  public metadata?: any;
  public sentAt?: Date;
  public deliveredAt?: Date;
  public openedAt?: Date;
  public clickedAt?: Date;
  public customerId!: string;
  public campaignId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;

  // Associations
  public getCustomer!: () => Promise<Customer>;
  public getCampaign!: () => Promise<Campaign | null>;
}

Communication.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM("email", "sms", "push", "social", "other"),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(
        "pending",
        "sent",
        "delivered",
        "failed",
        "opened",
        "clicked"
      ),
      defaultValue: "pending",
      allowNull: false,
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    subject: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    metadata: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    openedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    clickedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    customerId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: Customer,
        key: "id",
      },
    },
    campaignId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: Campaign,
        key: "id",
      },
    },
  },
  {
    sequelize,
    tableName: "communications",
    timestamps: true,
  }
);

// Define relationships
Communication.belongsTo(Customer, {
  foreignKey: "customerId",
  as: "customer",
});

Communication.belongsTo(Campaign, {
  foreignKey: "campaignId",
  as: "campaign",
});

Customer.hasMany(Communication, {
  foreignKey: "customerId",
  as: "communications",
});

Campaign.hasMany(Communication, {
  foreignKey: "campaignId",
  as: "communications",
});

export default Communication;
