import { OrderItemResponse, OrderResponse } from "./order-response";
export interface OrderItemUI extends OrderItemResponse {
  unitTotal: number; // price + soma complements
  subtotal: number; // unitTotal * quantity
}

export interface OrderUI extends OrderResponse {
  itemsCount: number;
}

export function adaptOrderToUI(order: OrderResponse): OrderUI {
  return {
    ...order,
    itemsCount: order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
  };
}
