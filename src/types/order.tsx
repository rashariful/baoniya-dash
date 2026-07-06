// src/types/order.ts
export const shippingStatus = {
  PENDING: "pending",
  READY: "ready to delivery",
  DELIVERED: "delivered",
  CANCELED: "canceled",
  RETURNED: "returned",
} as const;

export type ShippingStatus = keyof typeof shippingStatus;

export interface CustomerInfo {
  name: string;
  phone: string;
  // email?: string;
  // address?: string;
}

export interface Pricing {
  grandTotal: number;
  // discount?: number;
  // deliveryCharge?: number;
}

export interface Order {
  _id: string;
  status: ShippingStatus;
  customerInfo: CustomerInfo;
  createdAt: string;
  pricing: Pricing;
  // items?: any[]; // পরে extend করতে পারো
}

export interface OrdersResponse {
  data: Order[];
  meta: { total: number };
}