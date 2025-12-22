import { OrderStatus } from "@prisma/client";

export interface CreateOrderDTO {
    storeId: string;
    customerName: string;
    customerPhone: string;
    items: {
        productId: string;
        quantity: number;
        complements: {
            complementId: string;
            quantity: number;
        }[];
    }[];
}

export interface UpdateOrderStatusDTO {
    id: string;
    status: OrderStatus;
}