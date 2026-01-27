import { FastifyReply, FastifyRequest } from "fastify";
import GroupsComplementsService from "../services/groups-complements.service";
import { CreateComplementGroupInput } from "../schemas/complement-group.schema";
import { CreateGroupComplementInput } from "../repositorires/groups-complements.repository";


export class GroupsComplementsController {
    constructor(private service: GroupsComplementsService) { }

    async findAll(req: FastifyRequest<{ Params: { storeId: string }; Querystring: { productId: string } }>, reply: FastifyReply) {
        const { storeId } = req.params;
        const { productId } = req.query

        const result = await this.service.findAll({ storeId, productId });
        return reply.status(200).send(result);
    }

    async create(req: FastifyRequest<{ Body: CreateGroupComplementInput, Params: { storeId: string } }>, reply: FastifyReply) {

        const data = req.body;


        const result = await this.service.create({ data, storeId: req.params.storeId });

        return reply.status(201).send(result);
    }
    async update(req: FastifyRequest<{ Body: CreateComplementGroupInput, Params: { storeId: string, groupId: string } }>, reply: FastifyReply) {

        const data = req.body;
        const { storeId, groupId } = req.params;

        const result = await this.service.update({ data, storeId, groupId });

        return reply.status(200).send(result);
    }
    async createWithConnectProduct(req: FastifyRequest<{ Body: CreateGroupComplementInput[], Params: { storeId: string, productId: string } }>, reply: FastifyReply) {


        const data = req.body;



        const result = await this.service.createWithConnectProduct({ data, storeId: req.params.storeId, productId: req.params.productId });

        return reply.status(201).send(result);
    }
    async delete(req: FastifyRequest<{ Params: { storeId: string; groupId: string; productId: string; } }>, reply: FastifyReply) {
        const { groupId, productId } = req.params;

        console.log('Deleting group complement', { groupId, productId });

        try {
            await this.service.deleteProductConnection({ groupId, productId });
            return reply.status(204).send();
        } catch (error) {
            console.error('Error deleting group complement', error);
            return reply.status(404).send();
        }
    }

    async connectProduct(req: FastifyRequest<{ Params: { storeId: string; groupId: string; productId: string; } }>, reply: FastifyReply) {
        const { groupId, productId } = req.params;

        try {
            await this.service.connectProduct({ groupId, productId });
            return reply.status(204).send();
        } catch (error) {
            console.error('Error connecting group complement', error);
            return reply.status(500).send();
        }
    }
}
