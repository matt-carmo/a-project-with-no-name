import { PrismaClient } from "@prisma/client";

export class ImageRepository {
    constructor(private prisma: PrismaClient) {

    }
    async saveImage({ storeId, url }: { storeId: string, url: string }) {
        return this.prisma.image.create({
            data: {
                storeId,
                url,
            }
        });
    }
    async getImagesByStoreId({ storeId }: { storeId: string }) {
        return this.prisma.image.findMany({
            where: {
                storeId,
            }
        });
    }
    async deleteImage({ imageId }: { imageId: string }) {
        return this.prisma.image.delete({
            where: {
                id: imageId,
            }
        });
    }
}