import { z } from "zod";


export const productSchema = z.object({
    id: z.string().optional(), // gerado pelo banco
    storeId: z.string(),
    categoryId: z.string().nullable().optional(),
    photoUrl: z.string().nullable().optional(),
    name: z.string().min(1, "Nome do produto é obrigatório").max(100, "Nome do produto é muito longo"),
    description: z.string().nullable().optional(),
    price: z.number().min(0.01, "Preço é obrigatório"),
    image: z.any().optional(),
    isAvailable: z.boolean().optional(),
    stock: z.number().optional(),
    createdAt: z.date().optional(),
    deletedAt: z.date().nullable().optional(),
    productComplementGroups: z.array(
        z.object({
            // groupId: z.string(),
            id: z.string().optional(),
            minSelected: z.number().optional(),
            maxSelected: z.number().optional(),
        })
    ).optional(),
});

// Para criar um produto (sem campos automáticos):
export const createProductSchema = productSchema.omit({
    id: true,
    createdAt: true,
    deletedAt: true,
});
