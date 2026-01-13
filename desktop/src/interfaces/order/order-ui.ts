import { OrderItem, Order } from "./order-response";
export interface OrderItemUI extends OrderItem {
  unitTotal: number; // price + soma complements
  subtotal: number; // unitTotal * quantity
}

export interface OrderUI extends Order {
  itemsCount: number;
}

export function adaptOrderToUI(order: Order): OrderUI {
  return {
    ...order,
    itemsCount: order.items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
  };
}
