import { Prisma, PrismaClient } from "@prisma/client";

export type CreateGroupComplementInput = {
    storeId: string;
} & Omit<Prisma.ComplementGroupCreateInput, "products" | "complements"> & {
    complements: Omit<Prisma.ComplementCreateInput, "group">[];
};

export class GroupsComplementsRepository {
    constructor(private prisma: PrismaClient) { }

    async findAll({ storeId, productId: id }: { storeId: string, productId?: string }) {
        return this.prisma.complementGroup.findMany({
            where: {
                storeId,
                deletedAt: null,
                products: { ...id ? { some: { productId: id } } : undefined }
            },
            include: {
                complements: true,
                products: {
                    select: {
                        product: {
                            select: {
                                name: true
                            }
                        }
                    }
                },
            },
        });
    }
    async create(raw: CreateGroupComplementInput) {
        const { complements, storeId, ...group } = raw;

        return this.prisma.complementGroup.create({
            data: {
                ...group,
                store: {
                    connect: { id: storeId },
                },

                complements: {
                    createMany: {
                        data: complements,
                    },
                },
            },
        });
    }
    async createWithConnectProduct({data, storeId, productId,}: {data: CreateGroupComplementInput[]; storeId: string; productId: string;}) {


        
       return await this.prisma.$transaction(async (tx) => {
            return Promise.all(
                data.map((group) =>
                    tx.complementGroup.create({
                        data: {
                            name: group.name,
                            store: { connect: { id: storeId } },
                            products: {
                                create: {
                                    product: { connect: { id: productId } },
                                },
                            },
                        },
                    })
                )
            );
        });

    }


}
