import z from "zod";
import { ProductRepository } from "../repositorires/product.repository";
import { updateProductSchema } from "../schemas/product.shema";

import { ProductComplementGroup } from "@prisma/client";
import { CreateProductDTO } from "../schemas/create-product.dto";
import { parseMultipartProduct } from "../utils/parseMultipart";

export class ProductService {
    constructor(private repo: ProductRepository) { }
    async createProduct({ product, params }: { product: CreateProductDTO, params: { storeId: string; categoryId: string } }) {
        if (product.productComplementGroups?.length) {
            return this.repo.createProductWithComplementsGroups({ data: product, storeId: params.storeId, categoryId: params.categoryId, productComplementGroups: product.productComplementGroups as Array<any> });
        }
        return this.repo.createProduct({ data: product, storeId: params.storeId, categoryId: params.categoryId });
    }
    async updateProduct({ rawData, productId }: { rawData: z.infer<typeof updateProductSchema>, productId: string }) {

        return this.repo.updateProduct({ data: rawData, productId });
    }
    async deleteProduct({ productId }: { productId: string }) {
        return this.repo.deleteProduct({ productId });
    }

}