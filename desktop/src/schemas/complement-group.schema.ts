import z from "zod";

/**
 * Schema representando o objeto completo (ex.: vindo do banco)
 */
export const complementGroupSchema = z.object({
  id: z.cuid(),
  name: z.string().min(1, "Nome da categoria é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(1000).optional().nullable(),
  minSelected: z.number().int().nonnegative().default(0),
  maxSelected: z.number().int().positive().optional().nullable(),
  isAvailable: z.boolean().default(true),
  storeId: z.cuid(),

//   complements: z.array(z.any()).optional(),
//   products: z.array(z.any()).optional(),    
}).superRefine((obj, ctx) => {
  if (obj.maxSelected != null) {
    if (obj.maxSelected < obj.minSelected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "maxSelected deve ser maior ou igual a minSelected",
        path: ["maxSelected"],
      });
    }
  }
});


export const createComplementGroupSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório").max(100, "Nome muito longo"),
  description: z.string().max(1000).optional().nullable(),
  minSelected: z.number().int().nonnegative().optional().default(0),
  maxSelected: z.number().int().positive().optional().nullable(),
  isAvailable: z.boolean().optional().default(true),

  storeId: z.cuid(),
  // Se quiser aceitar relações já criadas no payload, descomente / substitua:
  // complements: z.array(complementCreateSchema).optional(),
  // products: z.array(productComplementGroupCreateSchema).optional(),
}).superRefine((obj, ctx) => {
  if (obj.maxSelected != null && obj.maxSelected < obj.minSelected) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "maxSelected deve ser maior ou igual a minSelected",
      path: ["maxSelected"],
    });
  }
});

/**
 * Schema para atualização parcial.
 */
export const updateComplementGroupSchema = createComplementGroupSchema.partial();

/**
 * Types
 */
export type ComplementGroup = z.infer<typeof complementGroupSchema>;
export type CreateComplementGroupInput = z.infer<typeof createComplementGroupSchema>;
export type UpdateComplementGroupInput = z.infer<typeof updateComplementGroupSchema>;
