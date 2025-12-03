import * as argon2 from "argon2";

import { FastifyInstance } from "fastify";
import { UserRepository } from "../repositorires/user.repository";

export class AuthService {
  constructor(private server: FastifyInstance) {
    this.repository = new UserRepository();
  }

  private repository: UserRepository;

  async signup(userData: { email: string; password: string; name: string }) {
    const { email, password, name } = userData;

    const existingUser = await this.repository.findUnique(email);
    if (existingUser) {
      return {error: 'Usuário já existe'}; // User already exists
    }
    const passwordHash = await argon2.hash(password);
    const newUser = await this.repository.create({
      email,
      password: passwordHash,
      name,
    });
    if (!newUser) {
      return {error: 'Login inválido'}; // Error creating user
    }

    return newUser;
  }

async login(email: string, password: string) {
  const user = await this.repository.findUnique(email);

  if (!user) {
    return { error: "Login inválido" };
  }

  const isPasswordValid = await argon2.verify(user.password, password);
  if (!isPasswordValid) {
    return { error: "Login inválido" };
  }

  const token = this.server.jwt.sign({
    userId: user.id,
    email: user.email,
  });

  // Remover a senha antes de expor
  const { password: _, ...safeUser } = user;

  return { user: safeUser, token };
}


  static async refreshToken(token: string) {
    // refresh token logic
  }
}
