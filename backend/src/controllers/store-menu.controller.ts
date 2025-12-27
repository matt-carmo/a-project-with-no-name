import { FastifyReply, FastifyRequest } from "fastify";
import { StoreMenuService } from "../services/store-menu.service";

export class StoreMenuController {
    constructor(private service: StoreMenuService) {}

    async getMenuByStoreId(
        req: FastifyRequest<{ Params: { storeId: string } }>,
        reply: FastifyReply
    ) {
        const { storeId } = req.params;
        const menu = await this.service.getMenuByStoreId(storeId);
        return reply.status(200).send(menu);
    }
     async getCustomerMenuByStoreId(
        req: FastifyRequest<{ Params: { storeId: string } }>,
        reply: FastifyReply
    ) {
        const { storeId } = req.params;
        const menu = await this.service.getCustomerMenuByStoreId(storeId);
        return reply.status(200).send(menu);
    }
}