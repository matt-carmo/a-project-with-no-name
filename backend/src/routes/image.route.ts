import { FastifyInstance } from "fastify";
import { ImageRepository } from "../repositorires/image.repository";
import { ImageController } from "../controllers/image.controller";
import { ImageService } from "../services/image-service";
import z from "zod";

export function ImageRoutes(server: FastifyInstance) {
    const repo = new ImageRepository(server.prisma);
    const service = new ImageService(repo);
    const controller = new ImageController(service);
    server.post(
        "/stores/:storeId/images",
        {
            schema: {
                params: z.object({ storeId: z.cuid() }),
                body: z.object({ image: z.any() })
            }

        },

        controller.uploadImage.bind(controller)
    );
    server.get(
        "/stores/:storeId/images",
        {
            schema: {
                params: z.object({ storeId: z.cuid() }),
            }
        },
        controller.getImagesByStoreId.bind(controller)
    );
    server.delete(
        "/images/:imageId",
        {
            schema: {
                params: z.object({ imageId: z.cuid() }),
            }
        },
        controller.deleteImage.bind(controller)
    );  
}