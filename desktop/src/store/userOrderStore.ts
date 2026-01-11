import { create } from "zustand";
import { Order } from "@/interfaces/order/order-response";

let audio: HTMLAudioElement | null = null;

interface OrderState {
  orders: Order[];
  setOrders: (orders: Order[]) => void;
  selectedOrder: Order | null;
  setSelectedOrder: (order: Order | null) => void;
}

const useOrderStore = create<OrderState>((set, get) => ({
  orders: [],
  selectedOrder: null,
  setOrders: (orders) => {
    const hadPending = get().orders.some(
      (o) => o.status === "PENDING"
    );

    const hasPending = orders.some(
      (o) => o.status === "PENDING"
    );

    // 🔊 Start sound
    if (!hadPending && hasPending) {
      if (!audio) {
        audio = new Audio("/order-sound.mp3");
        audio.loop = true;
      }
      audio.play();
    }

    // 🔇 Stop sound
    if (hadPending && !hasPending) {
      audio?.pause();
      audio!.currentTime = 0;
    }

    set({ orders });
  },
  setSelectedOrder: (order) => set({ selectedOrder: order }),
}));

export default useOrderStore;
