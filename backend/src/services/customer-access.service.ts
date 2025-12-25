import { FastifyInstance } from "fastify";


export class CustomerAccessService {
  constructor(private server: FastifyInstance) {}

  generateLinkToken(payload: { orderId: string; phone?: string }) {
    return this.server.jwt.sign(payload, {
      expiresIn: "1h",
    });
  }

  verifyLinkToken(token: string) {
    return this.server.jwt.verify(token) as {
      orderId: string;
      phone?: string;
      iat: number;
      exp: number;
    };
  }
}
