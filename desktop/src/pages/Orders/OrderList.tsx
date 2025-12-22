import api from "@/api/axios";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Order } from "@/interfaces/order/order-response";
import { OrderStatus } from "@/interfaces/order/order-status";
import { getOrders } from "@/services/orders/getOrders";
import useOrderStore from "@/store/userOrderStore";
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
  [OrderStatus.IN_DELIVERY]: 
  {
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

export function OrderList({
  orders,
  loading,
}: {
  orders: Order[];
  loading: boolean;
}) {
  const [selectedOrderId, setSelectedOrderId] = useState<string>();
  const { setSelectedOrder } = useOrderStore();


  const handleSelectOrder = (order: Order) => {
    setSelectedOrderId(order.id);

    setSelectedOrder(order);
  };
  // useEffect(() => {
  //   setSelectedOrderId(orders[0]?.id);
  //   setSelectedOrder(orders[0]);
  // }, []);

  useEffect(() => {
    getOrders();
  }, []);
  const handleAcceptOrder = useCallback(async (order:Order) => {
    const response = await api.patch(`/orders/${order.id}/status`, {
      status: OrderStatus.CONFIRMED,
    });
    if (response.status === 200) {
      getOrders();
      setSelectedOrder(
        {
          ...order,
          status: OrderStatus.CONFIRMED,
        } as Order
       );
   
    }
  }, []);
  return (
    <ul className="space-y-2">
      {orders?.map((order) => {
        const statusConfig = ORDER_STATUS_CONFIG[order.status as OrderStatus];

        return (
          <li key={order.id}>
            <button
              onClick={() => handleSelectOrder(order)}
              className="w-full p-0 text-sm overflow-hidden"
            >
              <Card
                className={`
                  flex flex-col gap-2 py-4 hover:bg-accent/50 bg-muted/10 border-accent
                  text-start
                  ${selectedOrderId === order.id && "border-primary"}
                `}
              >
                <CardHeader className="flex flex-row items-center justify-between py-0">
                  <span className="font-medium">
                    #{order.id} • {order.customerName}
                  </span>

                  <span
                    className={`text-xs px-2 py-1 rounded-md ${
                      selectedOrderId === order.id
                        ? "bg-primary/10 text-primary"
                        : statusConfig.className
                    }`}
                  >
                    {statusConfig.label}
                  </span>
                </CardHeader>

                <CardContent className="py-0 text-muted-foreground">
                  {order.createdAt}
                </CardContent>

                <CardFooter className="py-0 text-xs text-muted-foreground">
                  {order.status === OrderStatus.PENDING && (
                    <Button
                      variant="default"
                      size="lg"
                      className="flex-1 border-0"
                      onClick={() => handleAcceptOrder(order)}
                    >
                      Aceitar
                    </Button>
                  )}
                </CardFooter>
              </Card>
            </button>
          </li>
        );
      })}
    </ul>
  );
}

/*
    STATUS '| ORDER ID | CUSTOMER | TOTAL | DATE | STATUS
*/
