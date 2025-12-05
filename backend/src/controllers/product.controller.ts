import { FastifyRequest, FastifyReply } from "fastify";
import type { Multipart } from "@fastify/multipart";
import "@fastify/multipart";
import { uploadImage } from "../services/upload-image";

export class ProductController {
  async createProduct(req: FastifyRequest, res: FastifyReply) {
    try {
      const parts = await req.parts();
      let form: Record<string, any> = {};
      for await (const part of parts) {
        if (part.type === "field") {
            form[part.fieldname] = part.value;
            continue;
        }
        if (part.file) {
            const filePart = part as Multipart;
            const buffer = await (filePart as any).toBuffer();
            const data = await uploadImage({ imageBuffer: buffer });
            return res.send({ message: data });
            if (data.success) {
                
            }
        }
      
      }
   
      return await res.status(201).send({ message: form });
    } catch (error) {
      console.error("Erro ao criar produto:", error);
      return res.status(500).send({ error: "Erro ao criar produto" });
    }
  }
}
