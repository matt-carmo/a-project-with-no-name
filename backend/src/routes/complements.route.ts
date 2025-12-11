import z from "zod";
import { categorySchema } from "../schemas/category.schema";
import { CategoryRepository } from "../repositorires/category.repository";

import { CategoryController } from "../controllers/category.controller";
import { FastifyInstance } from "fastify";
import { ComplementsRepository } from "../repositorires/complements.repository";
import { ComplementsService } from "../services/complements.service";
import { ComplementsController } from "../controllers/complements.controller";
import { Prisma } from "@prisma/client";
import { omit } from "zod/v4/core/util.cjs";
import { ComplementCreateSchema, ComplementUpdateSchema } from "../schemas/complement.schema";



export function ComplementsRoutes(server: FastifyInstance) {
    const repo = new ComplementsRepository(server.prisma);
    const service = new ComplementsService(repo);
    const controller = new ComplementsController(service);
    server.post(
        "/:storeId/complements",
        {
            schema: {
                params: z.object({ storeId: z.string() }),
                body: ComplementCreateSchema, // TODO: replace with a proper Zod schema for Prisma.ComplementCreateInput
            },
        },
        controller.create.bind(controller)
    );

    server.delete(
        "/complements/:id",
        {
            schema: {
                params: z.object({ id: z.string() }),
            },
        },
        controller.delete.bind(controller)
    );

    server.patch(
        "/complements/:id",
        {
            schema: {
                params: z.object({ id: z.string() }),
                body: ComplementUpdateSchema,
            },
        },
        controller.update.bind(controller)
    );
}
