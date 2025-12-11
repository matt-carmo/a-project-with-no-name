import { PrismaClient } from "@prisma/client";

export class StoreMenuRepository {
    constructor(private prisma: PrismaClient) {}

    findByStoreId(storeId: string) {
        return this.prisma.category.findMany({
            where: { storeId, deletedAt: null },
            include: {
                products: {
                    where: { deletedAt: null },
                    include:{
                        productComplementGroups:{
                            include:{
                                group:{
                                    include:{
                                        complements:true
                                    }
                                }
                            }
                        }
                    }
                },
            },
        });
    }
}