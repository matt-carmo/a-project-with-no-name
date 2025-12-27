import "fastify";
import { FastifyJWT } from "@fastify/jwt";
import { PrismaClient } from "@prisma/client";
import { Readable } from "stream";
import type { JwtVerify } from "@fastify/jwt";
import type { ConsignmentsOrdersService } from "../services/ConsignmentsOrdersService";

declare module "fastify" {
  /* ---------- Route config (AQUI) ---------- */
  interface FastifyContextConfig {
    public?: boolean;
  }

  /* ---------- FastifyInstance ---------- */
  interface FastifyInstance {
    prisma: PrismaClient;
    jwt: FastifyJWT;
    consignmentsOrdersService: ConsignmentsOrdersService;
  }

  /* ---------- FastifyRequest ---------- */
  interface FastifyRequest {
    prisma: PrismaClient;
    jwtVerify: JwtVerify;
    file: () => Promise<{
      file: Readable;
      fieldname: string;
      filename: string;
      encoding: string;
      mimetype: string;
      fields: Record<string, string>;
    }>;
  }
}
