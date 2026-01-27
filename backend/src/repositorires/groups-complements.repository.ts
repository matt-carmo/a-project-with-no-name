import { Prisma, PrismaClient } from "@prisma/client";
import { UpdateComplementGroupInput } from "../schemas/complement-group.schema";

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
                    where: {
                        product: {
                            deletedAt: null
                        }
                    },
                    select: {
                        product:
                        {
                            select: {
                                name: true

                            }
                        }
                    }
                },
            },
        });
    }
    async update(raw: UpdateComplementGroupInput & { storeId: string; groupId: string; }) {
        const { storeId, groupId, complements, ...group } = raw;

        return await this.prisma.complementGroup.update({
            where: {
                id: groupId,
                storeId,
            },
            data: {
                ...group,
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
    async createWithConnectProduct({ data, storeId, productId, }: { data: CreateGroupComplementInput[]; storeId: string; productId: string; }) {

        const result = await this.prisma.$transaction(async (tx) => {
            return Promise.all(
                data.map((group) =>
                    tx.complementGroup.create({
                        data: {
                            name: group.name,
                            store: { connect: { id: storeId } },
                            minSelected: group.minSelected,
                            maxSelected: group.maxSelected,
                            isAvailable: group.isAvailable,
                            complements: {
                                createMany: {
                                    data: group.complements,
                                },
                            },
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
        return result;
    }



    async deleteProductConnection({ groupId, productId }: { groupId: string, productId: string }) {
        return this.prisma.productComplementGroup.delete({
            where: {
                productId_groupId: {
                    groupId,
                    productId,
                }
            }
        });
    }

    async connectProduct({ groupId, productId }: { groupId: string, productId: string }) {
        return this.prisma.productComplementGroup.create({
            data: {
                groupId,
                productId,
            },
        });
    }


}
