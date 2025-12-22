import { PrismaClient } from "@prisma/client";
import { createProductSchema, updateProductSchema } from "../schemas/product.shema";
import z from "zod";
import { complementGroupSchema } from "../schemas/complement-group.schema";

export class ProductRepository {
    constructor(private prisma: PrismaClient) {

    }
    async getById(productId: string) {
        return this.prisma.product.findUnique({
            where: { id: productId, deletedAt: null },
        });
    }
    async createProduct({ data, storeId, categoryId }: { data: z.infer<typeof createProductSchema>, storeId: string, categoryId: string }) {

        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                photoUrl: data.image?.url,
                stock: data.stock ?? null,
                categoryId,
                isAvailable: data.isAvailable,
                storeId,
            }
        });
    }
    async createProductWithComplementsGroups({ data, storeId, categoryId }: { data: z.infer<typeof createProductSchema>, storeId: string, categoryId: string } & { productComplementGroups: z.infer<typeof complementGroupSchema>[] }) {

        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId,
                stock: data.stock ?? null,
                photoUrl: data.image?.url,
                isAvailable: data.isAvailable,
                storeId,
                productComplementGroups: {
                    createMany: {
                        data: (data.productComplementGroups as Array<{ groupId: string }>).map((group) => ({
                            groupId: group.groupId,

                        }))
                    }
                }
            }
        });
    }
    async updateProduct({ productId, data }: { productId: string, data: z.infer<typeof updateProductSchema> }) {
        
        return this.prisma.product.update({
            where: { id: productId, storeId: data.storeId },
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                photoUrl: data.image?.url,
                // image: data.image?.url,
                stock: data.stock,
                categoryId: data.categoryId,
                isAvailable: data.isAvailable,
            }
        });
    }
    async deleteProduct({ productId }: { productId: string }) {
        return this.prisma.$transaction([
            this.prisma.product.update({
                where: { id: productId },
                data: {
                    deletedAt: new Date(),
                    isAvailable: false, // opcional, mas recomendado
                },
            }),

            this.prisma.productComplementGroup.deleteMany({
                where: { productId },
            }),
        ])
    }

}