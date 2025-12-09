import { FastifyReply, FastifyRequest } from "fastify";
import { ImageService } from "../services/image-service";
import { MultipartFile } from "@fastify/multipart";

export class ImageController {
    constructor(private imageService: ImageService) { }

    async uploadImage(req: FastifyRequest<{ Params: { storeId: string }, Body: { image: MultipartFile } }>, reply: FastifyReply) {
        const { storeId } = req.params;

        const file = await req.body.image; // Fastify entrega um único arquivo aqui

        if (!file) {
            return reply.code(400).send({ error: "File not provided" });
        }
        const result = await this.imageService.uploadImage({
            imageBuffer: file,
            storeId,
        });
        console.log(result);

        return reply.code(201).send({ data: result });
    }
    async getImagesByStoreId(req: FastifyRequest<{ Params: { storeId: string } }>, reply: FastifyReply) {
        const { storeId } = req.params;
        const images = await this.imageService.getImagesByStoreId({ storeId });
        return reply.code(200).send({ data: images });
    }
    async deleteImage(req: FastifyRequest<{ Params: { imageId: string } }>, reply: FastifyReply) {
        const { imageId } = req.params;
        await this.imageService.deleteImage({ imageId });
        return reply.code(204).send();
    }

}
