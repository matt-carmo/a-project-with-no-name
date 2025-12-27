import { FastifyInstance, FastifyPluginOptions } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { loginSchema, signupSchema } from "../schemas/auth.schema";
export default async function authRoute(
  server: FastifyInstance,
) {
  const authRoute = new AuthController(server);

  server.post(
    "/auth/signup",
    {
      config: { public: true },
      schema: { body: signupSchema },
    },
    authRoute.signup.bind(authRoute)
  );

  server.post(
    "/auth/login",
    {
      config: { public: true }, 
      schema: { body: loginSchema },
    },
    authRoute.login.bind(authRoute)
  );
}