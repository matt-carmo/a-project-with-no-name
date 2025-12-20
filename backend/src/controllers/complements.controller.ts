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
    async create(request: FastifyRequest<{ Body: Array<Prisma.ComplementUncheckedCreateInput>, Params: {storeId:string, groupId:string} }>, reply: FastifyReply) {
        const data = request.body;


        const { storeId, groupId } = request.params;
        

        console.log("Creating complements:", { storeId, groupId, data });
        data.forEach((complement) => {

            complement.groupId = groupId;
        });

        const created = await this.complementsService.createComplements(
            data
        );
        return reply.status(201).send(created);
    }

    async delete(request: FastifyRequest, reply: FastifyReply) {
        const { id } = request.params as { id: string };
        const res = await this.complementsService.deleteComplement({ id })
        if (res) {
            return reply.status(204).send();
        }
    };


    async update(request: FastifyRequest<{ Params: { id: string }; Body: Partial<Complement> }>, reply: FastifyReply) {

        const { id } = request.params as { id: string };
        const data = request.body;
                console.log("Body:2", request.body);

        return this.complementsService.updateComplement({ data, id });
    }
}