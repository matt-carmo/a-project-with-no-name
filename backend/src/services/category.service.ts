
import { CategoryRepository } from "../repositorires/category.repository";
import { Category } from "../schemas/category.schema";

export class CategoryService {
    constructor(private repository: CategoryRepository) {}

    async createCategory(data: Category) {
        return this.repository.createCategory(data);
    }

    async updateCategory(id: string, data: Partial<Category>) {
        return this.repository.updateCategory(id, data);
    }

    async deleteCategory(id: string) {
        return this.repository.deleteCategory(id);
    }
}