import { FastifyReply, FastifyRequest } from "fastify";
import { StoreUserService } from "../services/store-user.serivce";
import { CreateStoreUserInput, UpdateStoreUserInput } from "../schemas/store-user.schema";


export class StoreUserController {
  constructor(private service: StoreUserService) {}

  async add(
    req: FastifyRequest<{ Body: CreateStoreUserInput }>,
    reply: FastifyReply
  ) {
    const result = await this.service.addUserToStore(req.body);
    if ("error" in result) return reply.status(400).send(result);
    return reply.status(201).send(result);
  }

  async updateRole(
    req: FastifyRequest<{
      Params: { storeId: string; userId: string };
      Body: UpdateStoreUserInput;
    }>,
    reply: FastifyReply
  ) {
    const result = await this.service.updateRole(
      req.params.storeId,
      req.params.userId,
      req.body
    );

    if ("error" in result) return reply.status(404).send(result);

    return reply.send(result);
  }

  async list(
    req: FastifyRequest<{ Params: { storeId: string } }>,
    reply: FastifyReply
  ) {
    return reply.send(await this.service.listUsers(req.params.storeId));
  }

  async remove(
    req: FastifyRequest<{ Params: { storeId: string; userId: string } }>,
    reply: FastifyReply
  ) {
    const result = await this.service.remove(
      req.params.storeId,
      req.params.userId
    );

    if ("error" in result) return reply.status(404).send(result);

    return reply.status(204).send();
  }
}
