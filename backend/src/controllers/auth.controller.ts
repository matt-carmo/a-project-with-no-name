import { FastifyInstance, FastifyReply, FastifyRequest } from "fastify";

import { AuthService } from "../services/auth.service";
import { Prisma } from "@prisma/client";

export class AuthController {
  private authService: AuthService;
  constructor(private server: FastifyInstance) {
    this.authService = new AuthService(this.server);
  }
  async signup(
    request: FastifyRequest<{ Body: Prisma.UserCreateInput }>,
    reply: FastifyReply
  ) {
    const user = request.body;
    const result = await this.authService.signup({
      email: user.email,
      password: user.password,
      name: user.name,
    });
    if ("error" in result) {
      return reply.status(400).send({
        message: result.error,
        errors: [],
      });
    }
    const { token } = await this.authService.login(user.email, user.password);
    reply.status(201).send({ message: "User created successfully", token });
  }

  async login(request: FastifyRequest, reply: FastifyReply) {
    try {
      const { email, password } = request.body as {
        email: string;
        password: string;
      };
      const result = await this.authService.login(email, password);
      if ("error" in result) {
        return reply.status(401).send({
          message: result.error,
          errors: [],
        });
      }
      const { user, token } = result;
      reply.send({ user, token });
    } catch (error) {
      console.log(error);
    }
  }

  async refreshToken(request: FastifyRequest, reply: FastifyReply) {
    // refresh token logic
  }
}
