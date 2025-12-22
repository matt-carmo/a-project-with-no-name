export enum OrderStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  IN_PREPARATION = "IN_PREPARATION",
  READY = "READY",
  IN_DELIVERY = "IN_DELIVERY",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  IN_PREPARATION: "Em preparo",
  READY: "Pronto",
  IN_DELIVERY: "Em entrega",
  COMPLETED: "Finalizado",
  CANCELLED: "Cancelado",
};
