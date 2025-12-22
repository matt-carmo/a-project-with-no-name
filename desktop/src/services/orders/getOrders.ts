import api from "@/api/axios";
import { Order } from "@/interfaces/order/order-response";
import { useAuthStore } from "@/store/auth-store";
import useOrderStore from "@/store/userOrderStore";


export async function getOrders() {
    const selectedStore = useAuthStore.getState().selectedStore;
    const setOrders = useOrderStore.getState().setOrders;

    if (!selectedStore) return;

    try {
        const { data } = await api.get<Order[]>(
            `stores/${selectedStore.store.id}/orders`
        );
        setOrders(data);
        return { data };
    } catch (error) {
        console.error("Failed to fetch orders:", error);
    }
}
