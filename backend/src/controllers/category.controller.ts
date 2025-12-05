import { FastifyReply, FastifyRequest } from "fastify";
import { Category } from "../schemas/category.schema";
import { CategoryService } from "../services/category.service";

import { categorySchema } from "../schemas/category.schema";

export class CategoryController {
    
    constructor(private service: CategoryService) {}
    
    
    async createCategory(
        req: FastifyRequest<{
            Params: { storeId: string };
            Body: Pick<Category, "name" | 'storeId'>;
        }>,
        reply: FastifyReply
    ) {
        const { storeId } = req.params;
        const categoryData = { ...req.body, storeId };

        const category = await this.service.createCategory(categoryData);
        return reply.status(201).send(category);
    }
    async updateCategory(
        req: FastifyRequest<{
            Params: { id: string };
            Body: Partial<Category>;
        }>,
        reply: FastifyReply
    ) {
        const { id: categoryId } = req.params;
        const category = await this.service.updateCategory(categoryId, req.body);
        return reply.status(200).send(category);
    }
    async deleteCategory(
        req: FastifyRequest<{ Params: { id: string } }>,
        reply: FastifyReply
    ) {
        const { id: categoryId } = req.params;
        await this.service.deleteCategory(categoryId);
        return reply.status(204).send();
    }
    
}