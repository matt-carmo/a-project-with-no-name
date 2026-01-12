import {
  PaymentMethod,
  PaymentTiming,
  PaymentStatus,
} from "@prisma/client";

export interface CreateOrderDTO {
  // Loja
  storeId: string;

  // Cliente
  customerName?: string;
  customerPhone?: string;

  // 🔹 PAGAMENTO (DO PEDIDO)
  paymentMethod: PaymentMethod;
  paymentTiming: PaymentTiming;
  paymentStatus: PaymentStatus;
  // 🔹 SOMENTE PARA CASH
  paidAmount?: number;   // valor pago pelo cliente
  changeAmount?: number; // troco (opcional, pode ser calculado no backend)

  // Itens do pedido
  items: {
    productId: string;
    quantity: number;

    complements?: {
      complementId: string;
      quantity: number;
    }[];
  }[];

  // Observações
  notes?: string;

  // 🔹 ENDEREÇO (opcional – pickup ou delivery)
  address?: {
    road: string;
    number?: string;
    district: string;
    city: string;
    state: string;
    zipCode?: string;
    complement?: string;

    lat: number;
    lon: number;
  };
}
