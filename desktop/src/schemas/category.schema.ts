import z from "zod";

export const categorySchema = z.object({
    id: z.cuid(),
    name: z.string().min(1, "Nome da categoria é obrigatório").max(100, "Nome da categoria é muito longo"),
    storeId: z.cuid(),
});

export const updateCategorySchema = categorySchema.partial();

export type Category = z.infer<typeof categorySchema>;
export type CreateCategoryInput =   Partial<Pick<Category, "name">>;