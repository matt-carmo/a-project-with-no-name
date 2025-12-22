import { Prisma, PrismaClient, OrderStatus } from "@prisma/client";

export class OrdersRepository {
  constructor(private prisma: PrismaClient) {}

  async createOrder({
    data,
  }: {
    data: Prisma.OrderCreateInput;
  }) {
    return this.prisma.order.create({
      data,
    });
  }

  async getOrderById({
    id,
  }: {
    id: string;
  }) {
    return this.prisma.order.findUnique({
      where: { id },
      include:{
        items:true
      }
    });
  }

  async listOrdersByStore({
    storeId,
  }: {
    storeId: string;
  }) {
    return this.prisma.order.findMany({
      where: { storeId },
      orderBy: { createdAt: "desc" },
      include: {
        items: {
            include:{
                complements:true
            }
        },

      }
    });
  }

  async updateOrderStatus({
    id,
    status,
  }: {
    id: string;
    status: OrderStatus;
  }) {
    return this.prisma.order.update({
      where: { id },
      data: { status },
    });
  }
}
