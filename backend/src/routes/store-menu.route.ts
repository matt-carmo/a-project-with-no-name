import { FastifyInstance } from "fastify";
import { FastifyReply } from "fastify/types/reply";
import z from "zod";
import { StoreMenuRepository } from "../repositorires/store-menu.repository";
import { StoreMenuService } from "../services/store-menu.service";
import { StoreMenuController } from "../controllers/store-menu.controller";

export async function storeMenuRoute(server: FastifyInstance) {
  const repo = new StoreMenuRepository(server.prisma);
  const service = new StoreMenuService(repo);
  const controller = new StoreMenuController(service);
  server.get(
    "/stores/:storeId/menu",
    {
        schema: {
          params: z.object({ storeId: z.cuid() }),
        },
    },
    controller.getMenuByStoreId.bind(controller)
  );
}
