import { Prisma, PrismaClient, OrderStatus } from "@prisma/client";

export class OrdersRepository {
  constructor(private prisma: PrismaClient) { }

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
      include: {
        items: true
      }
    });
  }

  async listOrdersByStore({
    storeId,
  }: {
    storeId: string;
  }) {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);
    return this.prisma.order.findMany({
      where: {
        storeId,
        OR: [
          // pedidos ainda abertos (qualquer data)
          {
            status: {
              in: ["PENDING", "CONFIRMED", "IN_PREPARATION", "READY", "IN_DELIVERY", "CANCELLED"],
            },
          },

          // pedidos finalizados hoje
          {
            status: "COMPLETED",
            createdAt: {
              gte: startOfToday,
            },
          },
        ],
      },

      orderBy: { createdAt: "desc" },
      include: {
        items: {
          include: {
            complements: true
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
