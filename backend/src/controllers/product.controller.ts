import { FastifyRequest, FastifyReply } from "fastify";
import type { Multipart } from "@fastify/multipart";
import "@fastify/multipart";
import { uploadImage } from "../services/image-service";
import { ProductService } from "../services/product.service";

export class ProductController {
    constructor(private productService: ProductService) { }
async createProductWithComplementsGroups(
  req: FastifyRequest<{ Params: { storeId: string } }>,
  reply: FastifyReply
) {
  try {
    const body = req.body as Record<string, any>;

    const form: Record<string, any> = {};
    let imageBuffer: Buffer | null = null;
   
    for (const key in body) {
      const field = body[key];

 
      if (field?.type === "field") {
        form[key] = field.value;
        continue;
      }

      if (field?.type === "file" && field.file) {
        imageBuffer = await field.toBuffer();
      }
    }

    let uploadImageResult: any;
    if (imageBuffer) {
      uploadImageResult = await uploadImage({ imageBuffer });
    } else {
      uploadImageResult = { success: false };
    }

    const data = {
      name: form.name,
      description: form.description,
      price: Number(form.price),
      photoUrl: uploadImageResult.success ? uploadImageResult.data.data.url : "",
      isAvailable: form.isAvailable === "true",
      stock: form.stock ? Number(form.stock) : null,
      storeId: req.params.storeId,
      categoryId: form.categoryId || null,
      productComplementGroups: form.productComplementGroups
        ? JSON.parse(form.productComplementGroups)
        : [],
    };

    if (!data.productComplementGroups.length) {
      const created = await this.productService.createProduct(data);
      return reply.status(201).send(created);
    }

    const createdAdvanced = await this.productService.createProductWithComplementsGroups(data);

    return reply.status(201).send(createdAdvanced);

  } catch (error) {
    console.error("Erro ao criar produto:", error);
    return reply.status(500).send({ error: "Erro ao criar produto" });
  }
}
}
