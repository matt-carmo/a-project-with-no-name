import { z } from "zod";

export const storeUserRoleEnum = z.enum(["OWNER", "ADMIN", "STAFF"]);

export const createStoreUserSchema = z.object({
  storeId: z.cuid(),
  userId: z.cuid(),
  role: storeUserRoleEnum.default("ADMIN"),
});

export const updateStoreUserSchema = z.object({
  role: storeUserRoleEnum.optional(),
});

export type CreateStoreUserInput = z.infer<typeof createStoreUserSchema>;
export type UpdateStoreUserInput = z.infer<typeof updateStoreUserSchema>;
