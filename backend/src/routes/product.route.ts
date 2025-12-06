import { FastifyInstance } from "fastify";
import { ProductController } from "../controllers/product.controller";
import z from "zod";
import { ProductService } from "../services/product.service";
import { ProductRepository } from "../repositorires/product.repository";
import { createProductSchema } from "../schemas/product.shema";

export function ProductRoutes(server: FastifyInstance) {
    const repo = new ProductRepository(server.prisma);
    const service = new ProductService(repo);
    const controller = new ProductController(service);
    server.post(
        "/stores/:storeId/products",
        {
            schema: {
                params: z.object({ storeId: z.cuid() }),
                // body: createProductSchema
            },
        

        },
        controller.createProductWithComplementsGroups.bind(controller)
    );


}