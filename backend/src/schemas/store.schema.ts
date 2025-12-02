import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(2, "Nome muito curto"),
  slug: z.string().min(2).regex(/^[a-z0-9-]+$/, "Slug inválido"),
  phoneNumber: z
    .string()
    .nullish()
    .refine(
      (v) => !v || /^\+?[0-9]{10,15}$/.test(v),
      "Número de telefone inválido"
    ),
});

export const updateStoreSchema = createStoreSchema.partial();

export type CreateStoreInput = z.infer<typeof createStoreSchema>;
export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
