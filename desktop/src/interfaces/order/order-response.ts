

import { OrderStatus } from "@/interfaces/order/order-status";
import {
  PaymentMethod,
  PaymentTiming,
  PaymentStatus,
} from "@/interfaces/order/payment";


export interface Order {
  id: string;
  storeId: string;

  // Cliente
  customerName?: string;
  customerPhone?: string;

  // Status
  status: OrderStatus;
  createdAt: string;

  // Totais
  total: number;
  notes?: string;

  // 🔹 PAGAMENTO
  paymentMethod: PaymentMethod;
  paymentTiming: PaymentTiming;
  paymentStatus: PaymentStatus;

  // 🔹 SOMENTE CASH
  paidAmount?: number | null;
  changeAmount?: number | null;

  // 🔹 ENDEREÇO
  street?: string;
  number?: string;
  district?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  complement?: string;

  // 🔹 GEOLOCALIZAÇÃO
  lat?: number | null;
  lon?: number | null;

  // Itens
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
