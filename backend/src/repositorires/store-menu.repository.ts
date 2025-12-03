import { PrismaClient } from "@prisma/client";

export class StoreMenuRepository {
    constructor(private prisma: PrismaClient) {}

    findByStoreId(storeId: string) {
        return this.prisma.category.findMany({
            where: { storeId },
            include: {
                products: {
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