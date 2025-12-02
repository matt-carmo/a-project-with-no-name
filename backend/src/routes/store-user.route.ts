import { FastifyInstance } from "fastify";
import { z } from "zod";
import { StoreUserController } from "../controllers/store-user.controller";
import { StoreUserRepository } from "../repositorires/store-user.repository";
import { createStoreUserSchema, updateStoreUserSchema } from "../schemas/store-user.schema";
import { StoreUserService } from "../services/store-user.serivce";


export async function storeUserRoutes(app: FastifyInstance) {
  const repo = new StoreUserRepository(app.prisma);
  const service = new StoreUserService(repo);
  const controller = new StoreUserController(service);

  app.post(
    "/store-users",
    {
      schema: {
        body: createStoreUserSchema,
      },
    },
    controller.add.bind(controller)
  );

  app.get(
    "/store-users/:storeId",
    {
      schema: {
        params: z.object({ storeId: z.string().cuid() }),
      },
    },
    controller.list.bind(controller)
  );

  app.patch(
    "/store-users/:storeId/:userId",
    {
      schema: {
        params: z.object({
          storeId: z.string().cuid(),
          userId: z.string().cuid(),
        }),
        body: updateStoreUserSchema,
      },
    },
    controller.updateRole.bind(controller)
  );

  app.delete(
    "/store-users/:storeId/:userId",
    {
      schema: {
        params: z.object({
          storeId: z.string().cuid(),
          userId: z.string().cuid(),
        }),
      },
    },
    controller.remove.bind(controller)
  );
}
