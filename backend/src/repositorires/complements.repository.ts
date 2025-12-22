import { Complement, ComplementGroup, Prisma, PrismaClient } from "@prisma/client";

export class ComplementsRepository {
    private prisma: PrismaClient;

    constructor(prisma: PrismaClient) {
        this.prisma = prisma;
    }

    async createComplement(data: Array<Prisma.ComplementUncheckedCreateInput>) {

        // async createComplement(data: z.infer<typeof ComplementCreateSchema>): Promise<Complement> {
        return await this.prisma.complement.createMany({ data });
    }
    async getById(id: string): Promise<Complement | null> {
        return this.prisma.complement.findUnique({
            where: { id },
        });
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

    async updateComplement({
        id,
        groupId,
        data,
    }: {
        id: string;
        groupId: string;
        data: Partial<Complement>;
    }): Promise<Complement> {
        return this.prisma.complement.upsert({
            where: { id },
            update: {
                photoUrl: data.photoUrl,
                name: data.name,
                price: data.price,
                description: data.description,
                isAvailable: data.isAvailable,
            },
            create: {
                id,
                groupId, // ✅ OBRIGATÓRIO
                name: data.name!,
                price: data.price!,
                isAvailable: data.isAvailable ?? true,
                photoUrl: data.photoUrl,
                description: data.description,
            },
        });
    }

    async deleteComplement({ id }: { id: string }): Promise<Complement> {
        return await this.prisma.complement.delete({
            where: { id }
        });
    }

}
