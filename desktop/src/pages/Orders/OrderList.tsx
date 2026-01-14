import api from "@/api/axios";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Order } from "@/interfaces/order/order-response";
import { OrderStatus } from "@/interfaces/order/order-status";
import { getOrders } from "@/services/orders/getOrders";
import useOrderStore from "@/store/userOrderStore";
import { convertBRL } from "@/utils/convertBRL";
import { User } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

export const ORDER_STATUS_CONFIG: Record<
  OrderStatus,
  {
    label: string;
    className: string;
  }
> = {
  [OrderStatus.PENDING]: {
    label: "Pendente",
    className: "bg-yellow-500/10 text-yellow-600",
  },
  [OrderStatus.CONFIRMED]: {
    label: "Aceito",
    className: "bg-blue-500/10 text-blue-600",
  },
  [OrderStatus.IN_PREPARATION]: {
    label: "Preparando",
    className: "bg-orange-500/10 text-orange-600",
  },
  [OrderStatus.READY]: {
    label: "Pronto",
    className: "bg-green-500/10 text-green-600",
  },
  [OrderStatus.IN_DELIVERY]: {
    label: "Em entrega",
    className: "bg-purple-500/10 text-purple-600",
  },
  [OrderStatus.COMPLETED]: {
    label: "Finalizado",
    className: "bg-emerald-500/10 text-emerald-600",
  },
  [OrderStatus.CANCELLED]: {
    label: "Cancelado",
    className: "bg-red-500/10 text-ORDER_STATUS_CONFIG-600",
  },
};

const paymentMethodLabel = (method?: string) => {
  switch (method) {
    case "CASH":
      return "Dinheiro";
    case "PIX":
      return "PIX";
    case "CREDIT_CARD":
      return "Cartão de Crédito";
    case "DEBIT_CARD":
      return "Cartão de Débito";
    default:
      return "-";
  }
};

const paymentTimingLabel = (timing?: string) =>
  timing === "ONLINE" ? "Online" : "Na entrega";

const buildOrderSummaryMessage = (order: Order) => {
  const createdAt = new Date(order.createdAt);
  const formattedDate = createdAt.toLocaleString("pt-BR");

  const itemsLines = order.items
    .map((item) => {
      const baseLine = `- ${item.quantity}x ${item.name} (${convertBRL(
        item.price * item.quantity
      )})`;

      const complementsLines =
        item.complements?.length > 0
          ? item.complements
              .map(
                (complement) =>
                  `   + ${complement.quantity}x ${complement.name} (${convertBRL(
                    complement.price * complement.quantity
                  )})`
              )
              .join("\n")
          : "";

      return complementsLines ? `${baseLine}\n${complementsLines}` : baseLine;
    })
    .join("\n");

  const paymentMethod = paymentMethodLabel(order.paymentMethod);
  const paymentTiming = paymentTimingLabel(order.paymentTiming);

  return [
    `✅ Seu pedido #${order.id} foi confirmado!`,
    "",
    `📅 Data: ${formattedDate}`,
    "",
    "🧾 Itens do pedido:",
    itemsLines,
    "",
    `💰 Total: ${convertBRL(order.total)}`,
    `💳 Pagamento: ${paymentMethod} (${paymentTiming})`,
    "",
    "Obrigado pelo seu pedido! 🙌",
  ].join("\n");
};

export function OrderList({
  orders,
  loading,
}: {
  orders: Order[];
  loading: boolean;
}) {
  const [selectedOrderId, setSelectedOrderId] =
    useState<string>();
  const { setSelectedOrder } = useOrderStore();

  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);
    setSelectedOrder(order);
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleAcceptOrder = useCallback(
    async (order: Order) => {
      try {
        const response = await api.patch(
          `/orders/${order.id}/status`,
          {
            status: OrderStatus.CONFIRMED,
          }
        );

        if (response.status === 200) {
          await getOrders();
          
          const updatedOrder: Order = {
            ...order,
            status: OrderStatus.CONFIRMED,
          } as Order;

          const payload: { phone: string; status: OrderStatus; summary: string } = {
            phone: response.data.customerPhone,
            status: updatedOrder.status,
            summary: buildOrderSummaryMessage(updatedOrder),
          };

          await window.order.sendStatus(payload);

          setSelectedOrder(updatedOrder);
        }
      } catch (error) {
        console.error("Erro ao aceitar pedido", error);
        await getOrders();
      }
    },
    [setSelectedOrder]
  );

  return (
    <ScrollArea className="absolute inset-0">
      <ul className="space-y-2 p-2">
        {orders?.map((order) => {
          const statusConfig =
            ORDER_STATUS_CONFIG[
              order.status as OrderStatus
            ];

          const isSelected =
            selectedOrderId === order.id;

          return (
            <li key={order.id}>
              <Card
                onClick={() =>
                  handleSelectOrder(order)
                }
                className={`
                  cursor-pointer transition
                  hover:bg-accent/50
                  ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "bg-muted/10"
                  }
                `}
              >
                <CardHeader className="flex flex-row items-center justify-between py-3">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground">
                      Pedido #{order.id}
                    </p>

                    <p className="flex items-center gap-2 font-medium">
                      <User size={18} />
                      {order.customerName ||
                        "Cliente não informado"}
                    </p>
                  </div>

                  <Badge
                    className={
                      isSelected
                        ? "bg-primary/10 text-primary"
                        : statusConfig.className
                    }
                  >
                    {statusConfig.label}
                  </Badge>
                </CardHeader>

                <CardContent className="py-0 text-xs text-muted-foreground">
                  {new Date(
                    order.createdAt
                  ).toLocaleString()}
                </CardContent>

                {order.status ===
                  OrderStatus.PENDING && (
                  <CardFooter className="pt-3">
                    <Button
                      size="sm"
                      className="w-full"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleAcceptOrder(order);
                      }}
                    >
                      Aceitar pedido
                    </Button>
                  </CardFooter>
                )}
              </Card>
            </li>
          );
        })}

        {!loading && orders?.length === 0 && (
          <li className="py-10 text-center text-sm text-muted-foreground">
            Nenhum pedido encontrado
          </li>
        )}
      </ul>
    </ScrollArea>
  );
}

/*
    STATUS '| ORDER ID | CUSTOMER | TOTAL | DATE | STATUS
*/
