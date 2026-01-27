import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import GroupsComplementsService from "../services/groups-complements.service";
import { GroupsComplementsController } from "../controllers/groups-complements.controller";
import { GroupsComplementsRepository } from "../repositorires/groups-complements.repository";
import { categorySchema } from "../schemas/category.schema";
import z from "zod";
import { complementGroupBaseSchema, createComplementGroupSchema } from "../schemas/complement-group.schema";

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
                body: z.array(
                    complementGroupBaseSchema.omit({ storeId: true })
                ),
            },
        },
        controller.createWithConnectProduct.bind(controller)
    )
    server.put(
        "/:storeId/groups-complements/:groupId",
        {
            schema: {
                params: z.object({
                    storeId: z.string(),
                    groupId: z.string(),
                }),
            },
        },
        controller.update.bind(controller)
    )
    server.delete(
        "/:storeId/products/:productId/groups-complements/:groupId",
        {
            schema: {
                params: z.object({
                    storeId: z.string(),
                    groupId: z.string(),
                    productId: z.string(),
                }),
            },
        },
        controller.delete.bind(controller)
    );

    server.post(
        "/:storeId/products/:productId/groups-complements/:groupId/connect",
        {
            schema: {
                params: z.object({
                    storeId: z.string(),
                    groupId: z.string(),
                    productId: z.string(),
                }),
            },
        },
        controller.connectProduct.bind(controller)
    );

}