import { StoreSettingsRepository } from "../repositorires/store-settings.repository";
import { UpdateStoreSettingsInput } from "../schemas/store-settings.schema";

export class StoreSettingsService {
  constructor(private repo: StoreSettingsRepository) {}

  async getByStoreId(storeId: string) {
    let settings = await this.repo.findByStoreId(storeId);
    
    // If settings don't exist, create default ones
    if (!settings) {
      settings = await this.repo.create(storeId);
    }
    
    return settings;
  }

  async update(storeId: string, data: UpdateStoreSettingsInput) {
    return this.repo.update(storeId, data);
  }
}
