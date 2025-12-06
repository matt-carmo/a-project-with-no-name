import fastify, { FastifyError } from "fastify";
import prismaPlugin from "./plugins/prisma";

import { ERRORS } from "./errors/app.errors";
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
            fileSize: 50 * 1024 * 1024, // 50MB (aumente se necessário)
            files: 1,
            fields: 20,
        }
    });
    server.addHook("onRequest", async (request, reply) => {
        try {
            if (request.url !== "/auth/signup" && request.url !== "/auth/login") {
                const payload = await request.jwtVerify();
                console.log(payload);
            }
        } catch (err) {
            console.log(err);
            reply.status(401).send({ message: "Unauthorized" });
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

    return server;
}
