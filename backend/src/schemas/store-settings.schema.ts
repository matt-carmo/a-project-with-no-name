import { z } from "zod";

export const updateStoreSettingsSchema = z.object({
  isOpen: z.boolean().optional(),
  minOrderValue: z.number().optional().nullable(),
  deliveryFee: z.number().optional().nullable(),
  pickupEnabled: z.boolean().optional(),
  deliveryEnabled: z.boolean().optional(),
  openHours: z.string().optional().nullable(),
});

export type UpdateStoreSettingsInput = z.infer<typeof updateStoreSettingsSchema>;
