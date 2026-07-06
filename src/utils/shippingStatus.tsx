// constants/shippingStatus.ts
export const shippingStatus = {
  PENDING: "pending",
  READY_TO_DELIVERY: "ready to delivery",
  CONFIRMED: "confirmed",
  DELIVERED: "delivered",
  CANCELED: "canceled",
  RETURNED: "returned",
  NOT_ANSWER: "no answer",
} as const;
