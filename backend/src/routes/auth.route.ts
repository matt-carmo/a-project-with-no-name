import { FastifyInstance } from "fastify";
import { AuthController } from "../controllers/auth.controller";
import { loginSchema, signupSchema } from "../schemas/auth.schema";

export default async function authRoute(server: FastifyInstance) {
  const authRoute = new AuthController(server);
  server.post(
    "/auth/signup",
    {
      schema: {
        body: signupSchema,
      },
    },
    authRoute.signup.bind(authRoute)
  );
  server.post("/auth/login", {
    schema: {
      body: loginSchema,
    },
  }, authRoute.login.bind(authRoute));
  
}
