import useOrderStore from "@/store/userOrderStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { convertBRL } from "@/utils/convertBRL";
import { ORDER_STATUS_CONFIG } from "./OrderList";
import { OrderStatus } from "@/interfaces/order/order-status";
import api from "@/api/axios";

import { getOrders } from "@/services/orders/getOrders";
import { Button } from "@/components/ui/button";
import { Order } from "@/interfaces/order/order-response";

export function OrderDetails() {
  const { selectedOrder, setSelectedOrder } = useOrderStore();

  if (!selectedOrder) {
    return (
      <Card>
        <CardContent className="p-6 text-muted-foreground">
          Nenhum pedido selecionado
        </CardContent>
      </Card>
    );
  }

  const statusConfig = ORDER_STATUS_CONFIG[selectedOrder.status as OrderStatus];

  const handleSetOrder = async (id: string, status: OrderStatus) => {
    try {
      const res = await api.patch(`/orders/${id}/status`, { status });

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
      console.error("Erro ao atualizar status do pedido", error);
      await getOrders();
    }
  };

  const hasAddress =
    selectedOrder.street || selectedOrder.city || selectedOrder.district;

  return (
    <Card className="w-full border-none">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          Pedido #{selectedOrder.id}
          <Badge className={statusConfig?.className}>
            {statusConfig?.label}
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* =======================
            INFORMAÇÕES
        ======================= */}
        <div className="text-sm space-y-1">
          <div>
            <span className="font-medium">Data:</span>{" "}
            {new Date(selectedOrder.createdAt).toLocaleString()}
          </div>

          {selectedOrder.customerName && (
            <div>
              <span className="font-medium">Cliente:</span>{" "}
              {selectedOrder.customerName}
            </div>
          )}

          {selectedOrder.customerPhone && (
            <div>
              <span className="font-medium">Telefone:</span>{" "}
              {selectedOrder.customerPhone}
            </div>
          )}

          {selectedOrder.notes && (
            <div>
              <span className="font-medium">Observações:</span>{" "}
              {selectedOrder.notes}
            </div>
          )}
        </div>

        {/* =======================
            ENDEREÇO
        ======================= */}
        {hasAddress && (
          <>
            <Separator />
            <div className="text-sm space-y-1">
              <h3 className="font-semibold">Endereço de entrega</h3>

              <div>
                {selectedOrder.street}
                {selectedOrder.number ? `, ${selectedOrder.number}` : ""}
              </div>

              {selectedOrder.district && <div>{selectedOrder.district}</div>}

              <div>
                {selectedOrder.city} - {selectedOrder.state}
              </div>

              {selectedOrder.zipCode && <div>CEP: {selectedOrder.zipCode}</div>}

              {selectedOrder.complement && (
                <div className="text-muted-foreground">
                  Obs: {selectedOrder.complement}
                </div>
              )}

              {/* 🔹 Opcional: coordenadas */}
              {selectedOrder.lat && selectedOrder.lon && (
                <div className="text-xs text-muted-foreground">
                  Lat: {selectedOrder.lat} | Lon: {selectedOrder.lon}
                </div>
              )}
            </div>
          </>
        )}

        <Separator />

        {/* =======================
            ITENS
        ======================= */}
        <div className="space-y-3">
          <h3 className="font-semibold">Itens</h3>

          {selectedOrder.items.map((item) => (
            <div
              key={item.id}
              className="rounded-md border border-accent-foreground/10 p-3 space-y-2"
            >
              <div className="flex justify-between">
                <span className="font-medium">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-sm">
                  {convertBRL(item.price * item.quantity)}
                </span>
              </div>

              {item.complements.length > 0 && (
                <div className="pl-4 space-y-1 text-sm text-muted-foreground">
                  {item.complements.map((complement) => (
                    <div key={complement.id} className="flex justify-between">
                      <span>
                        + {complement.quantity}x {complement.name}
                      </span>
                      <span>
                        {convertBRL(complement.price * complement.quantity)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        <Separator />

        {/* =======================
            TOTAL
        ======================= */}
        <div className="flex justify-between text-lg font-semibold">
          <span>Total</span>
          <span>{convertBRL(selectedOrder.total)}</span>
        </div>
        <div className="flex gap-x-2">
          {![OrderStatus.CANCELLED, OrderStatus.COMPLETED].includes(
            selectedOrder.status as OrderStatus
          ) && (
            <Button
              variant="destructive-outline"
              size="lg"
            
              onClick={() =>
                handleSetOrder(selectedOrder.id, OrderStatus.CANCELLED)
              }
            >
              Cancelar Pedido
            </Button>
          )}

          {/* =======================
            AÇÕES
        ======================= */}
          {(selectedOrder.status as OrderStatus) === OrderStatus.PENDING && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                handleSetOrder(selectedOrder.id, OrderStatus.CONFIRMED)
              }
            >
              Aceitar Pedido
            </Button>
          )}

          {(selectedOrder.status as OrderStatus) === OrderStatus.CONFIRMED && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                handleSetOrder(selectedOrder.id, OrderStatus.IN_PREPARATION)
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
                handleSetOrder(selectedOrder.id, OrderStatus.IN_DELIVERY)
              }
            >
              Despachar
            </Button>
          )}

          {(selectedOrder.status as OrderStatus) ===
            OrderStatus.IN_DELIVERY && (
            <Button
              size="lg"
              className="flex-1"
              onClick={() =>
                handleSetOrder(selectedOrder.id, OrderStatus.COMPLETED)
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
