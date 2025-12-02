import { StoreRepository } from "../repositorires/store.repository";
import { CreateStoreInput, UpdateStoreInput } from "../schemas/store.schema";


export class StoreService {
  constructor(private repo: StoreRepository) {}

  async create(data: CreateStoreInput) {
    const exists = await this.repo.findBySlug(data.slug);
    if (exists) return { error: "STORE_SLUG_ALREADY_EXISTS" };

    return this.repo.create(data);
  }

  async update(id: string, data: UpdateStoreInput) {
    const store = await this.repo.findById(id);
    if (!store) return { error: "STORE_NOT_FOUND" };

    return this.repo.update(id, data);
  }

  async findOne(id: string) {
    return this.repo.findById(id);
  }

  async findAll() {
    return this.repo.findAll();
  }

  async delete(id: string) {
    const store = await this.repo.findById(id);
    if (!store) return { error: "STORE_NOT_FOUND" };

    await this.repo.delete(id);
    return { success: true };
  }
}
