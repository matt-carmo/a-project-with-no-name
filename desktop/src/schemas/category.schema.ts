import z from "zod";

export const categorySchema = z.object({
    id: z.cuid(),
    name: z.string().min(1, "Nome da categoria é obrigatório").max(100, "Nome da categoria é muito longo"),
    storeId: z.cuid(),
});

const updateCategorySchema = categorySchema.partial();
const createCategorySchema = categorySchema.pick({ name: true, storeId: true });
export type { updateCategorySchema, createCategorySchema } ;
export type Category = z.infer<typeof categorySchema>;
export type UpdateCategory = z.infer<typeof updateCategorySchema>;
export type CreateCategory = z.infer<typeof createCategorySchema>;