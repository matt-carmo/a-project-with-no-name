import { PrismaClient } from "@prisma/client";
import { Category } from "../schemas/category.schema";

export class CategoryRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async createCategory(data: Category): Promise<Category> {
        return this.prisma.category.create({
            data,
        });
    }
    async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
        return this.prisma.category.update({
            where: { id },
            data,
        });
    }
    async deleteCategory(id: string): Promise<void> {
        await this.prisma.category.update({
            where: { id },
            data: { deletedAt: new Date() },
        });
    }
}