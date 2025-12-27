import fp from "fastify-plugin";
import type { FastifyPluginAsync } from "fastify";


const AuthPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.addHook("preHandler", async (request, reply) => {
   const isPublic = request.routeOptions.config?.public;

    if (isPublic) {
      return;
    }

    await request.jwtVerify();
  });
};

export default fp(AuthPlugin, {
  name: "auth",
  dependencies: ["jwt"], // garante ordem correta
});
