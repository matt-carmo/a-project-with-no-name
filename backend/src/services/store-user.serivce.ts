import { StoreUserRepository } from "../repositorires/store-user.repository";
import { CreateStoreUserInput, UpdateStoreUserInput } from "../schemas/store-user.schema";



export class StoreUserService {
  constructor(private repo: StoreUserRepository) {}

  async addUserToStore(data: CreateStoreUserInput) {
    const existing = await this.repo.findByIds(data.storeId, data.userId);
    if (existing) return { error: "USER_ALREADY_ASSIGNED" };

    return this.repo.create(data);
  }

  async updateRole(storeId: string, userId: string, data: UpdateStoreUserInput) {
    const exists = await this.repo.findByIds(storeId, userId);
    if (!exists) return { error: "STORE_USER_NOT_FOUND" };

    return this.repo.update(storeId, userId, data);
  }

  async listUsers(storeId: string) {
    return this.repo.findAll(storeId);
  }

  async remove(storeId: string, userId: string) {
    const exists = await this.repo.findByIds(storeId, userId);
    if (!exists) return { error: "STORE_USER_NOT_FOUND" };

    await this.repo.delete(storeId, userId);
    return { success: true };
  }
}
