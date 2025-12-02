import { PrismaClient, Store } from "@prisma/client";
import { CreateStoreInput, UpdateStoreInput } from "../schemas/store.schema";


export class StoreRepository {
  constructor(private prisma: PrismaClient) {}

  findAll() {
    return this.prisma.store.findMany();
  }

  findById(id: string) {
    return this.prisma.store.findUnique({
      where: { id },
      include: {
        categories: true,
        products: true,
        users: true,
        settings: true,
      },
    });
  }

  findBySlug(slug: string) {
    return this.prisma.store.findUnique({
      where: { slug },
    });
  }

  create(data: CreateStoreInput) {
    return this.prisma.store.create({
      data,
    });
  }

  update(id: string, data: UpdateStoreInput) {
    return this.prisma.store.update({
      where: { id },
      data,
    });
  }

  delete(id: string) {
    return this.prisma.store.delete({
      where: { id },
    });
  }
}
