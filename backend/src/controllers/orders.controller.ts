
import { FastifyRequest } from "fastify";
import { FastifyReply } from "fastify";
import { CreateOrderDTO } from "../dtos/orders.dto";
import { OrdersService } from "../services/orders.service";
import { OrderStatus } from "@prisma/client";

export class OrdersController {
  constructor(private ordersService: OrdersService) {}

  async createOrder(
    req: FastifyRequest<{
      Params: { storeId: string };
      Body: Omit<CreateOrderDTO, "storeId">;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { storeId } = req.params;
      const { items } = req.body;
      
      const result = await this.ordersService.createOrder({
        storeId,
        items,
        customerName: req.body.customerName,
        customerPhone: req.body.customerPhone,
        address: req.body.address,
        
      });

      return reply.status(201).send(result);
    } catch (error) {
      console.error("Erro ao criar pedido:", error);
      return reply.status(500).send({ error: "Erro ao criar pedido" });
    }
  }

  async listOrdersByStore(
    req: FastifyRequest<{ Params: { storeId: string } }>,
    reply: FastifyReply
  ) {
    try {
      const { storeId } = req.params;

      const result = await this.ordersService.listOrdersByStore({ storeId });

      return reply.status(200).send(result);
    } catch (error) {
      console.error("Erro ao listar pedidos:", error);
      return reply.status(500).send({ error: "Erro ao listar pedidos" });
    }
  }

  async updateOrderStatus(
    req: FastifyRequest<{
      Params: { orderId: string };
      Body: { status: OrderStatus };
      // Body: Pick<UpdateOrderStatusDTO, "status">;
    }>,
    reply: FastifyReply
  ) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      const result = await this.ordersService.updateOrderStatus({
        id: orderId,
        status,
      });

      return reply.status(200).send(result);
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
      return reply
        .status(500)
        .send({ error: "Erro ao atualizar status do pedido" });
    }
  }
}
