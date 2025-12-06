import { PrismaClient } from "@prisma/client";
import { createProductSchema } from "../schemas/product.shema";
import z from "zod";
import { Extend } from "zod/v4/core/util.cjs";
import { complementGroupSchema } from "../schemas/complement-group.schema";

export class ProductRepository {
    constructor(private prisma: PrismaClient) {

    }
    async createProduct(data: z.infer<typeof createProductSchema> ) {

        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                photoUrl: data.photoUrl,
                stock: data.stock ?? null,
                categoryId: data.categoryId,
                isAvailable: data.isAvailable,
                storeId: data.storeId,
            }
        });
    }
    async createProductWithComplementsGroups(data: z.infer<typeof createProductSchema & { productComplementGroups: z.infer<typeof complementGroupSchema>[] }>) {

        return this.prisma.product.create({
            data: {
                name: data.name,
                description: data.description,
                price: data.price,
                categoryId: data.categoryId,
                stock: data.stock ?? null,
                photoUrl: data.photoUrl,
                isAvailable: data.isAvailable,
                storeId: data.storeId,
                productComplementGroups: {
                    createMany: {
                        data: data.productComplementGroups.map((group) => ({
                            groupId: group.groupId,
                        

                        }))
                    }
                } 
            }
        });
    }
}