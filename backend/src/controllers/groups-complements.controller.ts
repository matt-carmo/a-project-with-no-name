import { FastifyReply, FastifyRequest } from "fastify";
import GroupsComplementsService from "../services/groups-complements.service";
import { CreateComplementGroupInput } from "../schemas/complement-group.schema";


export class GroupsComplementsController {
    constructor(private service: GroupsComplementsService) { }

    async create(req: FastifyRequest<{ Body: CreateComplementGroupInput, Params: { storeId: string } }>, reply: FastifyReply) {
        
        const data = {
            name: req.body.name,
            storeId: req.params.storeId,
            minSelected: req.body.minSelected,
            maxSelected: req.body.maxSelected,
            complements: req.body.complements,

            
        };


        const result = await this.service.create({ data, storeId: req.params.storeId });

        return reply.status(201).send(result);
    }
}
