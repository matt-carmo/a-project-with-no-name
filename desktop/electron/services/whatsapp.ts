import { sock } from "../whatsapp/socket";

type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PREPARATION"
  | "READY"
  | "IN_DELIVERY"
  | "COMPLETED"
  | "CANCELED";

export async function sendOrderStatus(
  phone: string,
  status: OrderStatus
) {
  if (!sock) {
    console.warn("⚠️ WhatsApp não conectado");
    return;
  }

  const messageMap: Record<OrderStatus, string> = {
    PENDING: "🕐 Seu pedido foi recebido",
    CONFIRMED: "✅ Pedido confirmado",
    IN_PREPARATION: "👨‍🍳 Pedido em preparo",
    READY: "📦 Pedido pronto",
    IN_DELIVERY: "🚚 Pedido em entrega" ,
    COMPLETED: "🎉 Pedido entregue com sucesso",
    CANCELED: "❌ Pedido cancelado",
  };

  console.log("Enviando status para", phone, ":", status);
  const message =
    messageMap[status] ??
    "📢 Seu pedido teve uma atualização";

  const jid = `${phone}@s.whatsapp.net`;

  await sock.sendMessage(jid, { text: message })

}
