import { z } from "zod";


export const productSchema = z.object({
    id: z.string().optional(),
    photoUrl: z.string().nullable().optional(),
    name: z.string(),
    description: z.string().nullable().optional(),
    imageBuffer: z.instanceof(Buffer).nullable().optional(),
    price: z.number().optional(),
    image: z.object({
        url: z.string(),
        id: z.string(),
    }).optional(),
    isAvailable: z.boolean().optional(),
    stock: z.number().optional().or(z.null()),
    createdAt: z.date().optional(),
    deletedAt: z.date().nullable().optional(),
    productComplementGroups: z.array(
        z.object({
            groupId: z.string().optional(),
            id: z.string().optional(),
            minSelected: z.number().optional(),
            maxSelected: z.number().optional(),

        })
    ).optional(),
});
export const updateProductSchema = productSchema.and(z.object({ categoryId: z.string(), storeId: z.string() }));
// Para criar um produto (sem campos automáticos):
export const createProductSchema = productSchema.omit({
    id: true,
    createdAt: true,
    deletedAt: true,
    imageBuffer: true,
});

