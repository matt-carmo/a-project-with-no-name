import { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/product.controller";
import z from "zod";

export function ProductRoutes(server: FastifyInstance) {
//   const repo = new StoreMenuRepository(server.prisma);
//   const service = new StoreMenuService(repo);
  const controller = new ProductController();
  server.post(
    "/stores/:storeId/products",
    {
        schema: {
          params: z.object({ storeId: z.cuid() }),
        },
        
    },
    controller.createProduct.bind(controller)
  );


}