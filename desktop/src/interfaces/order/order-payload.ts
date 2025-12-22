export interface CreateOrderPayload {
  customerName?: string;
  customerPhone?: string;
  notes?: string;

  items: CreateOrderItemPayload[];
}
export interface CreateOrderItemPayload {
  productId: string;
  quantity: number;

  complements?: CreateOrderItemComplementPayload[];
}
export interface CreateOrderItemComplementPayload {
  complementId: string;
}
