import z from "zod";
import { categorySchema } from "../schemas/category.schema";
import { CategoryRepository } from "../repositorires/category.repository";
import { FastifyInstance } from "fastify";
import { CategoryService } from "../services/category.service";
import { CategoryController } from "../controllers/category.controller";

export function CategoryRoutes(server: FastifyInstance) {

    const repo = new CategoryRepository(server.prisma);
    const service = new CategoryService(repo);
    const controller = new CategoryController(service);
    server.post(
        "/:storeId/categories",
        {
            schema: {
                params: categorySchema.pick({ storeId: true }),
                body: categorySchema.pick({ name: true }),

            },
        },
        controller.createCategory.bind(controller)
    );
}