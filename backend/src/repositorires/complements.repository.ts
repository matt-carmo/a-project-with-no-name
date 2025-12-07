import { ComplementGroup, PrismaClient } from "@prisma/client";
import { Category } from "../schemas/category.schema";

export class ComplementsRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }
    async getComplementsByStoreId(
        data: Pick<ComplementGroup, "storeId">
    ): Promise<ComplementGroup[]> {
        return this.prisma.complementGroup.findMany({
            where: { storeId: data.storeId },

            include: {
                complements: true,
                products: {
                    where: {
                        product: { deletedAt: null }
                    },

                    include: {
                        product: {
                            select: {
                                name: true
                            }
                        },


                    }
                }
            }
        });
    }

    // async updateCategory(id: string, data: Partial<Category>): Promise<Category> {
    //     return this.prisma.category.update({
    //         where: { id },
    //         data,
    //     });
    // }
    // async deleteCategory(id: string): Promise<void> {
    //     await this.prisma.category.update({
    //         where: { id },
    //         data: { deletedAt: new Date() },
    //     });
    // }
}
