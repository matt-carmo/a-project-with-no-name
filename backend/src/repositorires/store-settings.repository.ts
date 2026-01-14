import { PrismaClient } from "@prisma/client";
import { UpdateStoreSettingsInput } from "../schemas/store-settings.schema";

export class StoreSettingsRepository {
  constructor(private prisma: PrismaClient) {}

  async findByStoreId(storeId: string) {
    return this.prisma.storeSettings.findUnique({
      where: { storeId },
    });
  }

  async create(storeId: string) {
    return this.prisma.storeSettings.create({
      data: {
        storeId,
        isOpen: true,
        pickupEnabled: true,
        deliveryEnabled: true,
      },
    });
  }

  async update(storeId: string, data: UpdateStoreSettingsInput) {
    // Check if settings exist, if not create them
    const existing = await this.findByStoreId(storeId);
    
    if (!existing) {
      return this.create(storeId);
    }

    return this.prisma.storeSettings.update({
      where: { storeId },
      data,
    });
  }
}
