import z from "zod";

/**
 * Base schema (SEM refine)
 * Usado como base para create e update
 */
export const complementGroupBaseSchema = z.object({
  name: z.string().min(1).max(100),
  description: z.string().max(1000).optional().nullable(),
  minSelected: z.number().int().nonnegative().optional().default(0),
  maxSelected: z.number().int().positive().optional().nullable(),
  isAvailable: z.boolean().optional().default(true),
  storeId: z.cuid(),
});
const ComplementGroupBaseSchema = z.object({
  min: z.number(),
  max: z.number(),
});

export const CreateComplementGroupSchema =
  ComplementGroupBaseSchema.refine(
    (data) => data.min <= data.max,
    { message: "min must be less than max" }
  );

export const UpdateComplementGroupSchema =
  ComplementGroupBaseSchema.partial(); // ✅ OK

/**
 * Schema completo (ex.: vindo do banco)
 */
export const complementGroupSchema = complementGroupBaseSchema.extend({
  id: z.cuid(),
}).superRefine((obj, ctx) => {
  if (obj.maxSelected != null && obj.maxSelected < obj.minSelected) {
    ctx.addIssue({
      code: "custom",
      message: "maxSelected deve ser maior ou igual a minSelected",
      path: ["maxSelected"],
    });
  }
});

/**
 * Create (payload de criação)
 * Aqui a validação cruzada faz sentido
 */
export const createComplementGroupSchema =
  complementGroupBaseSchema.superRefine((obj, ctx) => {
    if (obj.maxSelected != null && obj.maxSelected < obj.minSelected) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "maxSelected deve ser maior ou igual a minSelected",
        path: ["maxSelected"],
      });
    }
  });

/**
 * Update (PATCH)
 * ❗ SEM refine
 */
export const updateComplementGroupSchema =
  complementGroupBaseSchema.partial();

/**
 * Types
 */
export type ComplementGroup = z.infer<typeof complementGroupSchema>;
export type CreateComplementGroupInput = z.infer<typeof createComplementGroupSchema>;
export type UpdateComplementGroupInput = z.infer<typeof updateComplementGroupSchema>;
