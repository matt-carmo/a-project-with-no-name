export type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "PREPARING"
  | "READY"
  | "DELIVERED"
  | "CANCELLED";

export interface Order {
  id: string;
  storeId: string;

  customerName?: string;
  customerPhone?: string;

  status: OrderStatus;
  total: number;
  notes?: string;
  createdAt: string;

  // 🔹 Endereço
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  complement?: string;

  // 🔹 Geolocalização
  lat?: number;
  lon?: number;

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
