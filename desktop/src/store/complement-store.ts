import { create } from "zustand";


// Types e constantes

export interface iComplement {
    product: {
        id: string | number;
        name: string;
    };

    id?: string | number;
    name: string;
    price: number;
    photoUrl: string | null;

}

export interface iComplementGroup {
    product: iComplement;
    products: iComplement[];
    id: string;
    minSelected: number;
    maxSelected: number;
    name: string;
    isAvailable: boolean;
    complements: iComplement[];
}


export const ComplementState = {
    "none-complement": "none-complement",
    "existing-complement": "existing-complement",
    "new-complement": "new-complement",
} as const;

export type ComplementState =
    (typeof ComplementState)[keyof typeof ComplementState];

export const complementIndexMap: Record<ComplementState, number> = {
    "none-complement": 0,
    "existing-complement": 2,
    "new-complement": 2,
};


// Store Types
export interface ComplementsStore {

    complementState: ComplementState;
    arrayLength: number;

    complements: iComplementGroup[];
    selectedComplements: iComplementGroup[];

    setComplementState: (state: ComplementState) => void;
    setArrayLength: (len: number) => void;

    setComplements: (
        value: iComplementGroup[] | ((prev: iComplementGroup[]) => iComplementGroup[])
    ) => void;

    setSelectedComplements: (
        value: iComplementGroup[] | ((prev: iComplementGroup[]) => iComplementGroup[])
    ) => void;

    addSelectedComplement: (complement: iComplementGroup) => void;
    removeSelectedComplement: (id: string | number) => void;
    clearSelectedComplements: () => void;

    resetComplement: () => void;
}

export const useComplementStore = create<ComplementsStore>((set) => ({
    complementState: "none-complement",
    arrayLength: 2,
    complements: [],
    selectedComplements: [],
    setComplementState: (state) => set({ complementState: state }),
    setArrayLength: (len) => set({ arrayLength: len }),

    setComplements: (value) =>
        set((state) => ({
            complements:
                typeof value === "function" ? value(state.complements) : value,
        })),

    setSelectedComplements: (value) =>
        set((state) => ({
            selectedComplements:
                typeof value === "function"
                    ? value(state.selectedComplements)
                    : value,
        })),
    addSelectedComplement: (complement) =>
        set((state) => ({
            selectedComplements: [...state.selectedComplements, complement],
        })),

    removeSelectedComplement: (id) =>
        set((state) => ({
            selectedComplements: state.selectedComplements.filter(
                (c) => c.id !== id
            ),
        })),

    clearSelectedComplements: () =>
        set(() => ({
            selectedComplements: [],
        })),
    resetComplement: () =>
        set(() => ({
            complementState: "none-complement",
            arrayLength: 2,
            complements: [],
            selectedComplements: [],
        })),

        
}));
