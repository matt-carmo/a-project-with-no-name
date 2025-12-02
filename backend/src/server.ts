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
export const server = fastify();
export function buildServer() {
  server.register(prismaPlugin);
  server.setValidatorCompiler(validatorCompiler);
  server.setSerializerCompiler(serializerCompiler);
  server.register(cors, {
    origin: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
  });

  server.register(require("@fastify/jwt"), {
    secret: "supersecret",
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
  server.register(storeRoutes)
  return server;
}
