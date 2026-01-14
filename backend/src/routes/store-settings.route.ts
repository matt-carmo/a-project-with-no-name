import { FastifyInstance } from "fastify";
import { StoreSettingsService } from "../services/store-settings.service";
import { StoreSettingsController } from "../controllers/store-settings.controller";
import { updateStoreSettingsSchema } from "../schemas/store-settings.schema";
import { StoreSettingsRepository } from "../repositorires/store-settings.repository";
import { z } from "zod";

export async function storeSettingsRoutes(app: FastifyInstance) {
  const repo = new StoreSettingsRepository(app.prisma);
  const service = new StoreSettingsService(repo);
  const controller = new StoreSettingsController(service);

  app.get(
    "/stores/:storeId/settings",
    {
      schema: {
        params: z.object({ storeId: z.string().cuid() }),
      },
    },
    controller.get.bind(controller)
  );

  app.patch(
    "/stores/:storeId/settings",
    {
      schema: {
        params: z.object({ storeId: z.string().cuid() }),
        body: updateStoreSettingsSchema,
      },
    },
    controller.update.bind(controller)
  );
}
