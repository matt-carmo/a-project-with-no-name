import { channel } from "node:diagnostics_channel";
import {
    CreateOrderDTO,

} from "../dtos/orders.dto";
import { ComplementsRepository } from "../repositorires/complements.repository";
import { OrdersRepository } from "../repositorires/orders.repository";
import { ProductRepository } from "../repositorires/product.repository";
import { RealtimeService } from "./realtime.service";
import { OrderStatus } from "@prisma/client";

export class OrdersService {
    constructor(
        private ordersRepository: OrdersRepository,
        private productsRepository: ProductRepository,
        private complementsRepository: ComplementsRepository
    ) { }

    async createOrder({ storeId, items, customerName,
        customerPhone
    }: CreateOrderDTO) {

        let total = 0;

        const itemsWithPrice: Array<{
            productId: string;
            name: string;
            price: number;
            quantity: number;
            complements: {
                id: string;
                name: string;
                price: number;
                quantity: number;
            }[];
            total: number;
        }> = [];

        for (const item of items) {
            const product = await this.productsRepository.getById(item.productId);


            if (!product || !product.isAvailable) {
                throw new Error("Produto indisponível");
            }

            let itemTotal = product.price * item.quantity;

            const complementsData: {
                id: string;
                name: string;
                price: number;
                quantity: number;
            }[] = [];

            for (const c of item.complements) {
                const complement = await this.complementsRepository.getById(
                    c.complementId
                );

                if (!complement || !complement.isAvailable) {
                    throw new Error("Complemento indisponível");
                }

                itemTotal += complement.price * c.quantity;

                complementsData.push({
                    id: complement.id,
                    name: complement.name,
                    price: complement.price,
                    quantity: c.quantity,
                });
            }

            total += itemTotal;

            itemsWithPrice.push({
                productId: product.id,
                name: product.name,
                price: product.price,
                quantity: item.quantity,
                complements: complementsData,
                total: itemTotal,
            });
        }


        const order = await this.ordersRepository.createOrder({
            data: {
                store: { connect: { id: storeId } },
                items: {
                    create: itemsWithPrice.map(item => ({
                        name: item.name,
                        productId: item.productId,

                        quantity: item.quantity,
                        price: item.price,
                        complements: {
                            create: item.complements.map(c => ({
                                complementId: c.id,
                                name: c.name,
                                quantity: c.quantity,
                                price: c.price,
                            }))
                        }
                    }))
                },
                customerName,
                customerPhone,
                notes: "",
                status: "PENDING",

                total
            }
        });
       
        const res = await RealtimeService.orderStatusUpdated(order.storeId, {
            orderId: order.id,
            status: order.status,
        });

        console.log("RealtimeService response:", res);
        return order
    }

    async listOrdersByStore({ storeId }: { storeId: string }) {
        return this.ordersRepository.listOrdersByStore({ storeId });
    }

    async updateOrderStatus({ id, status }: { id: string; status: OrderStatus }) {
        const order = await this.ordersRepository.getOrderById({ id });

        if (!order) {
            throw new Error("Pedido não encontrado");
        }

        if (order.status == "CANCELLED") {
            throw new Error("Pedido cancelado não pode ser atualizado");
        }

        return this.ordersRepository.updateOrderStatus({ id, status });
    }
}
