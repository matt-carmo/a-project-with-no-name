import z from "zod";
import { ProductRepository } from "../repositorires/product.repository";
import { createProductSchema } from "../schemas/product.shema";

export class ProductService {
    constructor(private repo: ProductRepository) {}
    async createProductWithComplementsGroups(data:  z.infer<typeof createProductSchema>) {
        return this.repo.createProductWithComplementsGroups(data);
    }
    async createProduct(data: z.infer<typeof createProductSchema>) {
    
        return this.repo.createProduct(data);
    }

}