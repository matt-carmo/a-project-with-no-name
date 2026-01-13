import { getSock } from "../whatsapp/socket";


type OrderStatus =
  | "PENDING"
  | "CONFIRMED"
  | "IN_PREPARATION"
  | "READY"
  | "IN_DELIVERY"
  | "COMPLETED"
  | "CANCELLED";

export async function sendOrderStatus(
  phone: string,
  status: OrderStatus
) {
  const sock = getSock(); // ✅ AQUI DENTRO

  if (!sock) {
    console.warn("⚠️ WhatsApp não conectado");
    return;
  }

  const messageMap: Record<OrderStatus, string> = {
    PENDING: "🕐 Seu pedido foi recebido",
    CONFIRMED: "✅ Pedido confirmado",
    IN_PREPARATION: "👨‍🍳 Pedido em preparo",
    READY: "📦 Pedido pronto",
    IN_DELIVERY: "🚚 Pedido em entrega",
    COMPLETED: "🎉 Pedido entregue com sucesso",
    CANCELLED: "❌ Pedido cancelado",
  };

  console.log("📤 Enviando status para", phone, ":", status);

  const message =
    messageMap[status] ?? "📢 Seu pedido teve uma atualização";

  const cleanPhone = phone.replace(/\D/g, "");
  const jid = `55${cleanPhone}@s.whatsapp.net`;
  const results = await sock.onWhatsApp(jid);
  const result = results?.[0];
  
if (!result?.exists) {
  throw new Error('Número não existe no WhatsApp');
}

  await sock.sendMessage(result.jid, {
  text: message
  });

  console.log("✅ Mensagem enviada");
}
