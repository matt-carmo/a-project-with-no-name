import { FastifyRequest, FastifyReply } from "fastify";
import type { Multipart } from "@fastify/multipart";
import "@fastify/multipart";
import { uploadImage } from "../services/image-service";
import { ProductService } from "../services/product.service";

export class ProductController {
    constructor(private productService: ProductService) { }
    async createProductWithComplementsGroups(req: FastifyRequest<{ Params: { storeId: string }; Multipart: Multipart }>, res: FastifyReply) {
        try {
            const parts = req.parts();
            const form: Record<string, any> = {};

            let imageBuffer: Buffer | null = null;
            for await (const part of parts) {
                if (part.type === "field") {
                    form[part.fieldname] = part.value;
                } else if (part.file) {
                    const fileBuffer = await part.toBuffer();
                    imageBuffer = fileBuffer;
                }
            }

           

            let uploadImageResult: any 
            if (imageBuffer) {
                uploadImageResult = await uploadImage({ imageBuffer });
            } else {
                uploadImageResult = { success: false };
            }
            const data = {
                name: form.name,
                description: form.description,
                price: parseFloat(form.price),
                photoUrl: uploadImageResult.success ? uploadImageResult.data.data.url : "",
                isAvailable: form.isAvailable === "true",
                stock: Number(form.stock) ?? null,
                storeId: req.params.storeId,
                categoryId: form.categoryId || null,
                productComplementGroups: form.productComplementGroups ? JSON.parse(form.productComplementGroups) : null,

            }

            if (data.productComplementGroups.length === 0) {

                const createdProduct = await this.productService.createProduct(data);
                return res.status(201).send(createdProduct);
            }
            const createdProductWithComplements = await this.productService.createProductWithComplementsGroups(data);

            return res.status(201).send(createdProductWithComplements);

        } catch (error) {
            console.error("Erro ao criar produto:", error);
            return res.status(500).send({ error: "Erro ao criar produto" });
        }
    }
}
