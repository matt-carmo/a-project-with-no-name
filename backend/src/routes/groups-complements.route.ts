import { FastifyInstance } from "fastify";

import GroupsComplementsService from "../services/groups-complements.service";
import { GroupsComplementsController } from "../controllers/groups-complements.controller";
import { GroupsComplementsRepository } from "../repositorires/groups-complements.repository";
import { categorySchema } from "../schemas/category.schema";



export function GroupsComplementsRoutes(server: FastifyInstance) {
    const repo = new GroupsComplementsRepository(server.prisma);

    const service = new GroupsComplementsService(repo)
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