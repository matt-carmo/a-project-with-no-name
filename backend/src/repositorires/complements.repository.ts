import { Complement, ComplementGroup, Prisma, PrismaClient } from "@prisma/client";
import { Category } from "../schemas/category.schema";
import { CreateComplementGroupInput } from "../schemas/complement-group.schema";
import { ComplementCreateSchema } from "../schemas/complement.schema";
import z from "zod";

export class ComplementsRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async createComplement(data: Prisma.ComplementUncheckedCreateInput): Promise<Complement> {

    // async createComplement(data: z.infer<typeof ComplementCreateSchema>): Promise<Complement> {
        return this.prisma.complement.create({data});
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

    async updateComplement({ id, data }: { id: string, data: Partial<Complement> }): Promise<Complement> {
        return this.prisma.complement.update({
            where: { id },
            data,
        });
    }
    async deleteComplement({ id }: { id: string }): Promise<Complement> {
        return await this.prisma.complement.delete({
            where: { id }
        });
    }

}
