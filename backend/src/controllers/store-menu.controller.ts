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
}