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

    // server.get(
    //     "/stores/:storeId/products/:productId",
    //     {
    //         schema: {
    //             params: z.object({ storeId: z.cuid(), productId: z.cuid() }),
    //         },
    //     },
    //     repo.getById.bind(repo)
    // )
    server.post(
        "/stores/:storeId/products/:categoryId",
        {
            schema: {
                params: z.object({ storeId: z.cuid(), categoryId: z.cuid() }),
                body: createProductSchema
            },
        },
        
        controller.createProduct.bind(controller)
    );
    server.patch(
        "/stores/:storeId/products/:productId",
        {
            schema: {
                params: z.object({ storeId: z.cuid(), productId: z.cuid() }),
                body: createProductSchema.partial()
            },
        },
        controller.updateProduct.bind(controller)
    );
    server.delete(
        "/stores/:storeId/products/:productId",
        {
            schema: {
                params: z.object({ storeId: z.cuid(), productId: z.cuid() }),
            },
        },
        controller.deleteProduct.bind(controller)
    );


}