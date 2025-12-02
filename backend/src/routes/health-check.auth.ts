import { FastifyInstance, FastifyReply } from "fastify";
export default async function healthCheckRoute(server: FastifyInstance) {
  server.get("/health-check", async (_: any, reply: FastifyReply) => {
    return reply.status(200).send({ status: "OK" });
  });
}
