import { FastifyInstance, FastifyRequest } from "fastify";
import { OrdersController } from "../controllers/orders.controller";
import { OrdersService } from "../services/orders.service";
import { OrdersRepository } from "../repositorires/orders.repository";
import { ProductRepository } from "../repositorires/product.repository";
import { ComplementsRepository } from "../repositorires/complements.repository";
import { CreateOrderDTO } from "../dtos/orders.dto";
import { OrderStatus } from "@prisma/client";

export async function OrdersRoutes(app: FastifyInstance) {
  const ordersRepository = new OrdersRepository(app.prisma);
  const productsRepository = new ProductRepository(app.prisma);
  const complementsRepository = new ComplementsRepository(app.prisma);

  const ordersService = new OrdersService(
    ordersRepository,
    productsRepository,
    complementsRepository
  );

  const ordersController = new OrdersController(ordersService);

  app.post(
    "/stores/:storeId/orders",
    {
      config: { public: true },

    },
    async (req:FastifyRequest<{
      Params: { storeId: string };
      Body: Omit<CreateOrderDTO, "storeId">;
    }>, reply) => {
      return ordersController.createOrder(req, reply);
    }
  );

  app.get(
    "/stores/:storeId/orders",
    async (req: FastifyRequest<{ Params: { storeId: string } }>, reply) => {
      return ordersController.listOrdersByStore(req, reply);
    }
  );

  app.patch(
    "/orders/:orderId/status",
    async (req: FastifyRequest<{
      Params: { orderId: string };
      Body: { status: OrderStatus };
      // Body: Pick<UpdateOrderStatusDTO, "status">;
    }>, reply) => {
      return ordersController.updateOrderStatus(req, reply);
    }
  );
}

 