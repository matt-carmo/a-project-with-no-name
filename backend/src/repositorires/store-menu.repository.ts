import { PrismaClient } from "@prisma/client";

export class StoreMenuRepository {
    constructor(private prisma: PrismaClient) {}

    // Menu completo (admin)
    findByStoreId(storeId: string) {
        return this.prisma.category.findMany({
            where: {
                storeId,
                deletedAt: null,
            },
            include: {
                products: {
                    where: {
                        deletedAt: null,
                    },
                    include: {
                        productComplementGroups: {
                            include: {
                                group: {
                                    include: {
                                        complements: true,
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }

    // Menu do cliente
    findCustomerMenuByStoreId(storeId: string) {
        return this.prisma.category.findMany({
            where: {
                storeId,
                deletedAt: null,
                isAvailable: true,
            },
            include: {
                products: {
                    where: {
                    deletedAt: null,
                       isAvailable: true,
                       
                    },
                    include: {
                        productComplementGroups: {
                            where: {
                                group: {
                                    isAvailable: true,
                                    deletedAt: null,
                                },
                            },
                            include: {
                                
                                group: {

                                    include: {
                                        complements: {
                                            where: {
                                                isAvailable: true,
                                            
                                            
                                            },
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });
    }
}
