import { FastifyReply, FastifyRequest } from "fastify";
import { StoreSettingsService } from "../services/store-settings.service";
import { UpdateStoreSettingsInput } from "../schemas/store-settings.schema";
import { z } from "zod";

export class StoreSettingsController {
  constructor(private service: StoreSettingsService) {}

  async get(
    req: FastifyRequest<{ Params: { storeId: string } }>,
    reply: FastifyReply
  ) {
    const settings = await this.service.getByStoreId(req.params.storeId);
    return reply.send(settings);
  }

  async update(
    req: FastifyRequest<{
      Params: { storeId: string };
      Body: UpdateStoreSettingsInput;
    }>,
    reply: FastifyReply
  ) {
    const result = await this.service.update(req.params.storeId, req.body);
    return reply.send(result);
  }
}
