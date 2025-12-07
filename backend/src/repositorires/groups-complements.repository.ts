import { Prisma, PrismaClient } from "@prisma/client";

export type CreateGroupComplementInput = {
  storeId: string;
} & Omit<Prisma.ComplementGroupCreateInput, "products" | "complements"> & {
  complements: Omit<Prisma.ComplementCreateInput, "group">[];
};

export class GroupsComplementsRepository {
  constructor(private prisma: PrismaClient) {}

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
}
