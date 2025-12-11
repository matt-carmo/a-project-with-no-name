import { FastifyReply, FastifyRequest } from "fastify";
import { ComplementsService } from "../services/complements.service";
import { Complement, Prisma } from "@prisma/client";
import { createComplementGroupSchema } from "../schemas/complement-group.schema";
import { z } from "zod";
import { ComplementCreateSchema } from "../schemas/complement.schema";

export class ComplementsController {
    private complementsService: ComplementsService;
    constructor(complementsService: ComplementsService) {
        this.complementsService = complementsService;
    }
    async get(request: FastifyRequest<{ Params: { storeId: string } }>, reply: FastifyReply) {
        const { storeId } = request.params;
        const complements = await this.complementsService.getComplementsByStoreId({ storeId });
        return reply.status(200).send(complements);
    }
    async create(request: FastifyRequest<{ Body: Prisma.ComplementUncheckedCreateInput}>, reply: FastifyReply) {
        const data = request.body;
        const created = await this.complementsService.createComplement(
            data
        );
        return reply.status(201).send(created);
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const res = await this.complementsService.deleteComplement({id})
        if (res) {
            return reply.status(204).send();
        }
    };
        
    
    async update(request: FastifyRequest<{ Params: { id: string }; Body: Partial<Complement> }>, reply: FastifyReply) {

        const { id } = request.params as { id: string };
        const data = request.body;


        return this.complementsService.updateComplement({ data, id });
    }
}