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
     file: () => Promise<{
      file: Readable;
      fieldname: string;
      filename: string;
      encoding: string;
      mimetype: string;
      fields: { [key: string]: string };
    }>
  }
  interface FastifyInstance {
    jwt: FastifyJWT;
  }

}
