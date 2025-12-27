import { create } from "zustand";
import { Product } from "@/app/s/[slug]/page";

/* =====================
   TIPOS
===================== */

export interface CartComplement {
  groupId: string;
  complementId: string;
  name: string;
  price: number;    // preço unitário
  quantity: number;
}

export interface CartItem {
  id: string;              // ID único do item no carrinho
  product: Product;
  complements: CartComplement[];
  quantity: number;        // quantidade do item
  totalPrice: number;      // preço UNITÁRIO (produto + complementos)
  note?: string;
}

interface CartState {
  items: CartItem[];

  add: (item: CartItem) => void;
  remove: (itemId: string) => void;
  increase: (itemId: string) => void;
  decrease: (itemId: string) => void;
  clear: () => void;

  total: () => number;      // total em centavos
  quantity: () => number;   // quantidade total de itens
}

/* =====================
   STORE
===================== */

export const useCart = create<CartState>((set, get) => ({
  items: [],

  /* ADICIONAR ITEM */
  add: (item) =>
    set((state) => {
      const exists = state.items.find(
        (i) => i.id === item.id
      );

      if (exists) {
        return {
          items: state.items.map((i) =>
            i.id === item.id
              ? { ...i, quantity: i.quantity + item.quantity }
              : i
          ),
        };
      }

      return {
        items: [...state.items, item],
      };
    }),

  /* REMOVER ITEM */
  remove: (itemId) =>
    set((state) => ({
      items: state.items.filter(
        (i) => i.id !== itemId
      ),
    })),

  /* AUMENTAR QUANTIDADE */
  increase: (itemId) =>
    set((state) => ({
      items: state.items.map((i) =>
        i.id === itemId
          ? { ...i, quantity: i.quantity + 1 }
          : i
      ),
    })),

  /* DIMINUIR QUANTIDADE */
  decrease: (itemId) =>
    set((state) => ({
      items: state.items
        .map((i) =>
          i.id === itemId
            ? { ...i, quantity: i.quantity - 1 }
            : i
        )
        .filter((i) => i.quantity > 0),
    })),

  /* LIMPAR CARRINHO */
  clear: () => set({ items: [] }),

  /* TOTAL DO CARRINHO */
  total: () =>
    get().items.reduce(
      (sum, item) =>
        sum + item.totalPrice * item.quantity,
      0
    ),

  /* QUANTIDADE TOTAL */
  quantity: () =>
    get().items.reduce(
      (sum, item) => sum + item.quantity,
      0
    ),
}));
