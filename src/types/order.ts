import { Address } from "./customer";

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Order {
  id: string;
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: string;
  paymentStatus: "unpaid" | "paid" | "refunded";
  shippingAddress?: Address;
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface OrderInput {
  customerId: string;
  items: OrderItem[];
  totalAmount: number;
  status?: "pending" | "processing" | "completed" | "cancelled";
  paymentMethod: string;
  paymentStatus?: "unpaid" | "paid" | "refunded";
  shippingAddress?: Address;
  metadata?: Record<string, any>;
}

export interface OrderListResponse {
  status: string;
  data: {
    orders: Order[];
    total: number;
    page: number;
    totalPages: number;
  };
}

export interface OrderResponse {
  status: string;
  data: Order;
}

export interface OrderCreateResponse {
  status: string;
  message: string;
  requestId: string;
}
