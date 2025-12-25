import { FastifyRequest, FastifyReply } from "fastify";

import { ProductService } from "../services/product.service";

import { CreateProductDTO } from "../schemas/create-product.dto";
import z from "zod";
import { updateProductSchema } from "../schemas/product.shema";

type CreateProductParams = {
    storeId: string;
    categoryId: string
};

export class ProductController {
    constructor(private productService: ProductService) { }

    async createProduct(
        req: FastifyRequest<{
            Params: CreateProductParams;
            Body: CreateProductDTO;
        }>,
        reply: FastifyReply
    ) {
        try {
            const body = req.body

            const result = await this.productService.createProduct(
                {
                    product: body,
                    params: req.params
                });
            if (result instanceof Error) {
                console.error(result)
                return reply.status(400).send({ error: result.message });
            }
            return reply.status(201).send(result);

        } catch (error) {
            console.error("Erro ao criar produto:", error);
            return reply.status(500).send({ error: "Erro ao criar produto" });
        }
    }
    async updateProduct(
        req: FastifyRequest<{ Params: { storeId: string; productId: string, }; Body: z.infer<typeof updateProductSchema>; }>,
        reply: FastifyReply
    ) {
        try {
            const body = req.body
            const result = await this.productService.updateProduct({ rawData: body, productId: req.params.productId })
            if (result instanceof Error) {
                return reply.status(400).send({ error: result.message });
            }
            return reply.status(200).send(result);

        } catch (error) {
            console.error("Erro ao atualizar produto:", error);
            return reply.status(500).send({ error: "Erro ao atualizar produto" });
        }
    }
    async deleteProduct(
        req: FastifyRequest<{ Params: { storeId: string; productId: string; }; }>,
        reply: FastifyReply
    ) {
        try {
            const result = await this.productService.deleteProduct({productId: req.params.productId});
            if (result instanceof Error) {
                return reply.status(400).send({ error: result.message });
            }
            return reply.status(204).send({ message: "Produto deletado com sucesso" });

        } catch (error) {
            console.error("Erro ao deletar produto:", error);
            return reply.status(500).send({ error: "Erro ao deletar produto" });
        }
    }
}