import z from "zod";
import { categorySchema } from "../schemas/category.schema";
import { CategoryRepository } from "../repositorires/category.repository";

import { CategoryController } from "../controllers/category.controller";
import { FastifyInstance } from "fastify";
import { ComplementsRepository } from "../repositorires/complements.repository";
import { ComplementsService } from "../services/complements.service";
import { ComplementsController } from "../controllers/complements.controller";

export function ComplementsRoutes(server: FastifyInstance) {
  const repo = new ComplementsRepository(server.prisma);
  const service = new ComplementsService(repo);
  const controller = new ComplementsController(service);
  server.get(
    "/:storeId/complements",
    {
      schema: {
        params: categorySchema.pick({ storeId: true }),
      },
    },
    controller.get.bind(controller)  
  )
//   server.post(
//     "/:storeId/complements",
//     {
//       schema: {
//         params: categorySchema.pick({ storeId: true }),
//         body: categorySchema.pick({ name: true }),
//       },
//     },
//     controller.createCategory.bind(controller)
//   );
  
//   server.delete(
//     "/complements/:id",
//     {
//       schema: {
//         params: categorySchema.pick({ id: true }),
//       },
//     },
//     controller.deleteCategory.bind(controller)
//   );

//   server.patch(
//     "/complements/:id",
//     {
//       schema: {
//         params: categorySchema.pick({ id: true }),
//         body: categorySchema.pick({ name: true }),
//       },
//     },
//     controller.updateCategory.bind(controller)
//   );
}
