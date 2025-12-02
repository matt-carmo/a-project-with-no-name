import { FastifyInstance } from "fastify";
import { StoreService } from "../services/store.service";
import { StoreController } from "../controllers/store.controller";
import { createStoreSchema, updateStoreSchema } from "../schemas/store.schema";
import z from "zod";
import { StoreRepository } from "../repositorires/store.repository";

export async function storeRoutes(app: FastifyInstance) {
  const service = new StoreService(new StoreRepository(app.prisma));
  const controller = new StoreController(service);

  app.post(
    "/stores",
    {
      schema: { body: createStoreSchema },
    },
    controller.create.bind(controller)
  );

  app.get("/stores", controller.findAll.bind(controller));

  app.get(
    "/stores/:id",
    {
      schema: {
        params: z.object({ id: z.cuid() }),
      },
    },
    controller.findOne.bind(controller)
  );

  app.patch(
    "/stores/:id",
    {
      schema: {
        body: updateStoreSchema,
        params: z.object({ id: z.cuid() }),
      },
    },
    controller.update.bind(controller)
  );

  app.delete(
    "/stores/:id",
    {
      schema: {
        params: z.object({ id: z.cuid() }),
      },
    },
    controller.delete.bind(controller)
  );
}
