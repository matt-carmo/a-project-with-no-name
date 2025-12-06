import { z } from "zod";


export const productSchema = z.object({
    id: z.string().optional(), // gerado pelo banco
    storeId: z.string(),
    categoryId: z.string().nullable().optional(),
    photoUrl: z.string().nullable().optional(),
    name: z.string(),
    description: z.string().nullable().optional(),
    price: z.number(),
    image: z.any().optional(),
    isAvailable: z.boolean().optional(),
    stock: z.number().optional(),
    createdAt: z.date().optional(),
    deletedAt: z.date().nullable().optional(),
    productComplementGroups: z.array(
        z.object({
            groupId: z.string(),
            id: z.string().optional(),
            minSelected: z.number().optional(),
            maxSelected: z.number().optional(),

        })
    ),
});

// Para criar um produto (sem campos automáticos):
export const createProductSchema = productSchema.omit({
    id: true,
    createdAt: true,
    deletedAt: true,
});
