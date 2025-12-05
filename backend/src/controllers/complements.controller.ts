import { FastifyReply, FastifyRequest } from "fastify";
import { ComplementsService } from "../services/complements.service";

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
}