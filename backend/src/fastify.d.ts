import { FastifyJWT } from "@fastify/jwt";
import "@fastify/type-provider-typebox";
import { PrismaClient } from "@prisma/client";
declare module "fastify" {
  interface FastifyInstance {
    prisma: PrismaClient;
  }
  interface FastifyRequest {
    prisma: PrismaClient;
  }
  interface FastifyInstance {
    consignmentsOrdersService: ConsignmentsOrdersService
  }
  interface FastifyRequest {
    jwtVerify: JwtVerify;
  }
  interface FastifyInstance {
    jwt: FastifyJWT;
  }
}
