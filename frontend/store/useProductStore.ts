// store/useProductStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Product } from "@/app/types/menu";

type ProductStore = {
  product: Product | null;
  setProduct: (product: Product) => void;
  clearProduct: () => void;
};

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      product: null,

      setProduct: (product) => set({ product }),

      clearProduct: () => set({ product: null }),
    }),
    {
      name: "selected-product",
    }
  )
);
