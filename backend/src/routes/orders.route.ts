import { FastifyInstance } from "fastify";
import { OrdersController } from "../controllers/orders.controller";
import { OrdersService } from "../services/orders.service";
import { OrdersRepository } from "../repositorires/orders.repository";
import { ProductRepository } from "../repositorires/product.repository";
import { ComplementsRepository } from "../repositorires/complements.repository";

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
    async (req, reply) => {
      return ordersController.createOrder(req, reply);
    }
  );

  app.get(
    "/stores/:storeId/orders",
    async (req, reply) => {
      return ordersController.listOrdersByStore(req, reply);
    }
  );

  app.patch(
    "/orders/:orderId/status",
    async (req, reply) => {
      return ordersController.updateOrderStatus(req, reply);
    }
  );
}
