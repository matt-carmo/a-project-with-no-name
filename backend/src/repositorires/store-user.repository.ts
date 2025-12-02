import { PrismaClient } from "@prisma/client";
import {
  CreateStoreUserInput,
  UpdateStoreUserInput,
} from "../schemas/store-user.schema";

export class StoreUserRepository {
  constructor(private prisma: PrismaClient) {}

  findAll(storeId: string) {
    return this.prisma.storeUser.findMany({
      where: { storeId },
      include: { user: true },
    });
  }

  findByIds(storeId: string, userId: string) {
    return this.prisma.storeUser.findUnique({
      where: {
        storeId_userId: { storeId, userId },
      },
      include: {
        user: true,
        store: true,
      },
    });
  }

  create(data: CreateStoreUserInput) {
    return this.prisma.storeUser.create({
      data,
    });
  }

  update(storeId: string, userId: string, data: UpdateStoreUserInput) {
    return this.prisma.storeUser.update({
      where: {
        storeId_userId: { storeId, userId },
      },
      data,
    });
  }

  delete(storeId: string, userId: string) {
    return this.prisma.storeUser.delete({
      where: {
        storeId_userId: { storeId, userId },
      },
    });
  }
}
