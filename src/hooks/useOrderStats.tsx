// src/types/order.ts  (আগের মতোই রাখো, শুধু reference)
// ... (shippingStatus, Order interface ইত্যাদি)

// src/hooks/useOrderStats.ts
import { Order, ShippingStatus } from "@/types/order";
import { useMemo } from "react";
// import { Order, ShippingStatus } from "@/types/order";

export function useOrderStats(orders: Order[]) {
  return useMemo(() => {
    const countBy = (status: ShippingStatus) =>
      orders.filter((o) => o.status === status).length;

    const sumBy = (status: ShippingStatus) =>
      orders
        .filter((o) => o.status === status)
        .reduce((sum, o) => sum + (o.pricing?.grandTotal ?? 0), 0);

    const stats = {
      total: orders.length,
      pending: countBy("pending"),
      ready: countBy("ready to delivery"),
      delivered: countBy("delivered"),
      canceled: countBy("canceled"),
      returned: countBy("returned"),

      pendingAmount: sumBy("pending"),
      readyAmount: sumBy("ready to delivery"),
      deliveredAmount: sumBy("delivered"),
      canceledAmount: sumBy("canceled"),
      returnedAmount: sumBy("returned"),
    };

    const conversionRate = stats.total > 0 ? (stats.delivered / stats.total) * 100 : 0;
    const avgOrderValue = stats.total > 0 ? stats.deliveredAmount / stats.total : 0;

    return { stats, conversionRate, avgOrderValue };
  }, [orders]);
}