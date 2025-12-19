import { z } from "zod";

export const ComplementSchema = z.object({
    id: z.cuid().optional(),        // Prisma gera automaticamente
    name: z.string().min(1, "Nome é obrigatório"),
    groupId: z.string().min(1, "groupId é obrigatório"),

    description: z.string().min(2).max(1000).optional(),

    price: z.number().int().nonnegative(),

    isAvailable: z.boolean().default(true),

    stock: z.number().int().nonnegative().optional().nullable(),

    photoUrl: z.url().optional().nullable(),
});
export const ComplementCreateSchema = ComplementSchema.omit({
    id: true,
});

export const ComplementUpdateSchema = ComplementCreateSchema.partial();

