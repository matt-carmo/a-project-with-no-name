import { FastifyReply, FastifyRequest } from "fastify";
import { StoreService } from "../services/store.service";
import { CreateStoreInput, UpdateStoreInput } from "../schemas/store.schema";

export class StoreController {
  constructor(private service: StoreService) {}

  async create(req: FastifyRequest<{ Body: CreateStoreInput }>, reply: FastifyReply) {
    const result = await this.service.create(req.body);

    if ("error" in result) {
      return reply.status(400).send(result);
    }

    return reply.status(201).send(result);
  }

  async update(
    req: FastifyRequest<{ Params: { id: string }; Body: UpdateStoreInput }>,
    reply: FastifyReply
  ) {
    const result = await this.service.update(req.params.id, req.body);

    if ("error" in result) {
      return reply.status(404).send(result);
    }

    return reply.send(result);
  }

  async findOne(req: FastifyRequest<{ Params: { slug: string } }>, reply: FastifyReply) {
    const store = await this.service.findOne(req.params.slug);

    if (!store) return reply.status(404).send({ error: "STORE_NOT_FOUND" });

    return reply.send(store);
  }

  async findAll(_: FastifyRequest, reply: FastifyReply) {
    return reply.send(await this.service.findAll());
  }

  async delete(req: FastifyRequest<{ Params: { id: string } }>, reply: FastifyReply) {
    await this.service.delete(req.params.id);
    return reply.status(204).send();
  }
}
