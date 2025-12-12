import { create } from "zustand";

// ---------------------------------------
// Types e constantes
// ---------------------------------------
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



export type ComplementStore = {
    complementState: ComplementState;
    setComplementState: (state: ComplementState) => void;


    getComplementIndex: () => number;

    resetComplement: () => void;
    setSelectedComplements: (complements: string[]) => void;
    setArrayLength: (length: number) => void;

    selectedComplements: string[];
    arrayLength: number;
};

export const useComplementStore = create<ComplementStore>((set, get) => ({
    complementState: "none-complement",
    arrayLength: 2,
    selectedComplements: [],
    setComplementState: (state) => {
        const current = get().complementState;
        const nextState = state === current ? "none-complement" : state;

        set({
            complementState: nextState,
            arrayLength:
                nextState === "existing-complement" ||
                nextState === "new-complement"
                    ? 4
                    : 2, 
        });
    },
    setedComplements: (complements: string[]) =>
        set({ selectedComplements: complements }),

    getComplementIndex: () => {
        const state = get().complementState;
        return complementIndexMap[state];
    },

    resetComplement: () =>
        set({
            complementState: "none-complement",
            arrayLength: 2, 
        }),

    setArrayLength: (length: number) => set({ arrayLength: length }),

    setSelectedComplements: (complements: string[]) =>
        set({ selectedComplements: complements }),
}));
