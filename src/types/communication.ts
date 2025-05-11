export type DeliveryStatus = "PENDING" | "SENT" | "FAILED";

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CommunicationLog {
  id: string;
  campaignId: string;
  customerId: string;
  message: string;
  status: DeliveryStatus;
  sentAt: string;
  updatedAt: string;
  failureReason?: string;
}
