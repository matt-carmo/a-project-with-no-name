import { create } from "zustand";

interface SheetComplementStore {
  open: boolean;
  setOpen: (val: boolean) => void;
}
export const useSheetComplementStore = create<SheetComplementStore>((set) => ({
  open: false,
  setOpen: (val: boolean) => set({ open: val }),
}));
