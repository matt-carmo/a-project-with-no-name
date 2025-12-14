import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import GroupsComplementsService from "../services/groups-complements.service";
import { GroupsComplementsController } from "../controllers/groups-complements.controller";
import { GroupsComplementsRepository } from "../repositorires/groups-complements.repository";
import { categorySchema } from "../schemas/category.schema";
import z from "zod";
import { createComplementGroupSchema } from "../schemas/complement-group.schema";
import { id } from "zod/v4/locales";



export function GroupsComplementsRoutes(server: FastifyInstance) {
    const repo = new GroupsComplementsRepository(server.prisma);

    const service = new GroupsComplementsService(repo)
    const controller = new GroupsComplementsController(service);

    server.get(
        "/:storeId/groups-complements",
        {
            schema: {
                params: categorySchema.pick({ storeId: true }),
                querystring: z.object({
                    productId: z.string().optional(),
                }),
            },
        },
        controller.findAll.bind(controller)
    )
    server.post(
        "/:storeId/groups-complements",
        {
            schema: {
                params: categorySchema.pick({ storeId: true }),
            },
        },
        controller.create.bind(controller)
    )
    server.post(
        "/:storeId/groups-complements/:productId",
        {
            schema: {
                params: z.object({
                    storeId: z.string(),
                    productId: z.string(),
                }),
                body: z.array(createComplementGroupSchema.omit({ storeId: true })),
            },
        },
        controller.createWithConnectProduct.bind(controller)
    ),
        server.delete(
            "/:storeId/groups-complements/:groupId/:productId",
            {
                schema: {
                    params: z.object({
                        storeId: z.string(),
                        groupId: z.string(),
                        productId: z.string(),
                    }),
                },
            },
            async (req:FastifyRequest<{ Params: { storeId: string; groupId: string; productId: string; } }>, reply: FastifyReply) => {
                const { storeId, groupId, productId } = req.params;
                
                await server.prisma.productComplementGroup.delete({
                    where: {
                        id: groupId,
                        productId,
                    
                    },
                });

                return reply.status(204).send();
            }
        );

}