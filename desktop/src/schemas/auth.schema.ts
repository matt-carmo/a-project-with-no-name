import { z } from "zod";

export const signupSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(8, "Senha precisa ter pelo menos 8 caracteres"),
  name: z.string().min(2, "Nome muito curto").max(50, "Nome muito longo"),
});

export const loginSchema = z.object({
  email: z.email("Email inválido"),
  password: z.string().min(1, "Senha obrigatória").min(8, "Senha precisa ter pelo menos 8 caracteres").max(64, "Senha muito longa"),
});

// Tipos inferidos automaticamente
export type SignupSchema = z.infer<typeof signupSchema>;
export type LoginSchema = z.infer<typeof loginSchema>;
