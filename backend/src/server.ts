import fastify, { FastifyError } from "fastify";
import prismaPlugin from "./plugins/prisma";
import cors from "@fastify/cors";
import authRoute from "./routes/auth.route";
import healthCheckRoute from "./routes/health-check.auth";
import {
    serializerCompiler,
    validatorCompiler,
} from "fastify-type-provider-zod";
import { storeRoutes } from "./routes/store.route";
import { storeUserRoutes } from "./routes/store-user.route";
import { storeMenuRoute } from "./routes/store-menu.route";
import { CategoryRoutes } from "./routes/category.route";
import { ComplementsRoutes } from "./routes/complements.route";
import { ProductRoutes } from "./routes/product.route";
import fastifyMultipart from "@fastify/multipart";
import { GroupsComplementsRoutes } from "./routes/groups-complements.route";
import { ImageRoutes } from "./routes/image.route";
import { OrdersRoutes } from "./routes/orders.route";
import { GeocodeRoutes } from "./routes/geocode-route";


export const server = fastify();
export function buildServer() {
    server.register(prismaPlugin);
    server.setValidatorCompiler(validatorCompiler);
    server.setSerializerCompiler(serializerCompiler);
    server.register(cors, {
        origin: true,
        allowedHeaders: ["Content-Type", "Authorization"],
        methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS", "PATCH"],
    });

    server.register(require("@fastify/jwt"), {
        secret: "supersecret",
    });
    server.register(fastifyMultipart, {
        limits: {
            fileSize: 50 * 1024 * 1024,
            files: 50,
            fields: 500,
        },
        attachFieldsToBody: true,
    });

    server.addHook("preHandler", async (request, reply) => {
        const isPublic = request.routeOptions.config?.public;

        
        // rota pública → não valida JWT
        if (isPublic) return;

        try {
            const payload = await request.jwtVerify();

        } catch (err) {
            return reply.status(401).send({ message: "Unauthorized" });
        }
    });


    server.setErrorHandler((error: FastifyError, request, reply) => {
        if (error.validation || error.name === "ZodError") {
            return reply.status(400).send({
                message: "Dados inválidos",
                errors: error.validation?.map((v) => ({
                    field: v.instancePath.replace("/", ""),
                    message: v.message,
                })),
            });
        }

        console.error(error);
        reply.status(500).send({
            message: "Erro interno no servidor",
        });
    });

    server.register(healthCheckRoute);
    server.register(authRoute);
    server.register(storeRoutes);
    server.register(storeUserRoutes);
    server.register(storeMenuRoute)
    server.register(ComplementsRoutes);
    server.register(CategoryRoutes)
    server.register(ProductRoutes);
    server.register(GroupsComplementsRoutes);
    server.register(ImageRoutes);
    server.register(OrdersRoutes);
    server.register(GeocodeRoutes);
    return server;
}
