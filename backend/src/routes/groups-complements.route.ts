import { FastifyInstance } from "fastify";

import GroupsComplementsService from "../services/groups-complements.service";
import { GroupsComplementsController } from "../controllers/groups-complements.controller";
import { GroupsComplementsRepository } from "../repositorires/groups-complements.repository";
import { categorySchema } from "../schemas/category.schema";
import { ImageService } from "../services/image-service";


export function GroupsComplementsRoutes(server: FastifyInstance) {
    const repo = new GroupsComplementsRepository(server.prisma);
    const imageSvc = new ImageService();
    const service = new GroupsComplementsService(repo, imageSvc)
    const controller = new GroupsComplementsController(service);
    server.post(
        "/:storeId/groups-complements",
        {
            schema: {
                params: categorySchema.pick({ storeId: true }),
        
            },
        

        },
        
        controller.create.bind(controller)
    )
}