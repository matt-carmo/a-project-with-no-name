export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELED";

export interface Order {
  id: string;
  storeId: string;
  customerName?: string;
  customerPhone?: string;
  status: OrderStatus;
  total: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  name: string;
  quantity: number;
  price: number;
  complements: OrderItemComplement[];
}

export interface OrderItemComplement {
  id: string;
  orderItemId: string;
  complementId?: string;
  name: string;
  price: number;
  quantity: number;
}
