import useOrderStore from "@/store/userOrderStore";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

import { convertBRL } from "@/utils/convertBRL";
import { ORDER_STATUS_CONFIG } from "./OrderList";
import { OrderStatus } from "@/interfaces/order/order-status";
import { Order } from "@/interfaces/order/order-response";

import api from "@/api/axios";
import { getOrders } from "@/services/orders/getOrders";

export function OrderDetails() {
  const { selectedOrder, setSelectedOrder } = useOrderStore();

  /* =======================
     FALLBACK
  ======================= */
  if (!selectedOrder) {
    return (
      <Card className="h-full flex items-center justify-center border-none">
        <CardContent className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="rounded-full bg-muted p-4 text-2xl">
            📦
          </div>

          <h3 className="text-lg font-semibold">
            Nenhum pedido selecionado
          </h3>

          <p className="text-sm text-muted-foreground max-w-xs">
            Selecione um pedido na lista ao lado para visualizar
            os detalhes.
          </p>
        </CardContent>
      </Card>
    );
  }

  const statusConfig =
    ORDER_STATUS_CONFIG[selectedOrder.status as OrderStatus];

  const hasAddress =
    selectedOrder.street ||
    selectedOrder.city ||
    selectedOrder.district;

  const handleSetOrder = async (
    id: string,
    status: OrderStatus
  ) => {
    try {
      const res = await api.patch(
        `/orders/${id}/status`,
        { status }
      );

      await getOrders();

      await window.order.sendStatus({
        phone: res.data.customerPhone,
        status,
      });

      setSelectedOrder({
        ...selectedOrder,
        status: res.data.status,
      } as Order);
    } catch (error) {
      console.error(
        "Erro ao atualizar status do pedido",
        error
      );
      await getOrders();
    }
  };

  /* =======================
     UI
  ======================= */
  return (
    <Card className="w-full border-none">
      {/* HEADER */}
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between gap-4">
          <div>
            <CardTitle className="text-xl">
              Pedido #{selectedOrder.id}
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Criado em{" "}
              {new Date(
                selectedOrder.createdAt
              ).toLocaleString()}
            </p>
          </div>

          <Badge className={statusConfig?.className}>
            {statusConfig?.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* =======================
            INFORMAÇÕES
        ======================= */}
        <Card className="bg-muted/40">
          <CardContent className="p-4 space-y-1 text-sm">
            {selectedOrder.customerName && (
              <div>
                <span className="font-medium">
                  Cliente:
                </span>{" "}
                {selectedOrder.customerName}
              </div>
            )}

            {selectedOrder.customerPhone && (
              <div>
                <span className="font-medium">
                  Telefone:
                </span>{" "}
                {selectedOrder.customerPhone}
              </div>
            )}

            {selectedOrder.notes && (
              <div className="text-muted-foreground">
                <span className="font-medium text-foreground">
                  Observações:
                </span>{" "}
                {selectedOrder.notes}
              </div>
            )}
          </CardContent>
        </Card>

        {/* =======================
            ENDEREÇO
        ======================= */}
        {hasAddress && (
          <Card className="bg-muted/40">
            <CardContent className="p-4 space-y-1 text-sm">
              <h3 className="font-semibold mb-2">
                Endereço de entrega
              </h3>

              <div>
                {selectedOrder.street}
                {selectedOrder.number &&
                  `, ${selectedOrder.number}`}
              </div>

              {selectedOrder.district && (
                <div>
                  {selectedOrder.district}
                </div>
              )}

              <div>
                {selectedOrder.city} -{" "}
                {selectedOrder.state}
              </div>

              {selectedOrder.zipCode && (
                <div>
                  CEP: {selectedOrder.zipCode}
                </div>
              )}

              {selectedOrder.complement && (
                <div className="text-muted-foreground">
                  Obs: {selectedOrder.complement}
                </div>
              )}
            </CardContent>
          </Card>
        )}

        <Separator />

        {/* =======================
            ITENS
        ======================= */}
        <div className="space-y-3">
          <h3 className="font-semibold">
            Itens do pedido
          </h3>

          <div className="space-y-2">
            {selectedOrder.items.map((item) => (
              <div
                key={item.id}
                className="rounded-lg bg-muted/40 p-3 space-y-2"
              >
                <div className="flex justify-between font-medium">
                  <span>
                    {item.quantity}x {item.name}
                  </span>
                  <span>
                    {convertBRL(
                      item.price * item.quantity
                    )}
                  </span>
                </div>

                {item.complements.length > 0 && (
                  <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                    {item.complements.map(
                      (complement) => (
                        <div
                          key={complement.id}
                          className="flex justify-between"
                        >
                          <span>
                            + {complement.quantity}x{" "}
                            {complement.name}
                          </span>
                          <span>
                            {convertBRL(
                              complement.price *
                                complement.quantity
                            )}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* =======================
            TOTAL
        ======================= */}
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="p-4 flex justify-between items-center">
            <span className="text-lg font-semibold">
              Total
            </span>
            <span className="text-2xl font-bold">
              {convertBRL(selectedOrder.total)}
            </span>
          </CardContent>
        </Card>

        {/* =======================
            AÇÕES
        ======================= */}
        <div className="flex gap-2">
          {![OrderStatus.CANCELLED, OrderStatus.COMPLETED].includes(
            selectedOrder.status as OrderStatus
          ) && (
            <Button
              variant="destructive-outline"
              size="lg"
            >
              Cancelar
            </Button>
          )}

          {selectedOrder.status ===
            OrderStatus.PENDING && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                handleSetOrder(
                  selectedOrder.id,
                  OrderStatus.CONFIRMED
                )
              }
            >
              Aceitar Pedido
            </Button>
          )}

          {selectedOrder.status ===
            OrderStatus.CONFIRMED && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                handleSetOrder(
                  selectedOrder.id,
                  OrderStatus.IN_PREPARATION
                )
              }
            >
              Iniciar Preparo
            </Button>
          )}

          {(selectedOrder.status as OrderStatus) ===
            OrderStatus.IN_PREPARATION && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                handleSetOrder(
                  selectedOrder.id,
                  OrderStatus.IN_DELIVERY
                )
              }
            >
              Despachar
            </Button>
          )}

          {(selectedOrder.status as OrderStatus) ===
            OrderStatus.IN_DELIVERY  && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                handleSetOrder(
                  selectedOrder.id,
                  OrderStatus.COMPLETED
                )
              }
            >
              Marcar como Entregue
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
