export type StepStore = {
    step: number;
    setStep: (step: number) => void;
    nextStep: () => void;
    prevStep: () => void;
    resetStep: () => void;
};

import { create } from "zustand";

export const useStepStore = create<StepStore>((set, get) => ({
    step: 1,

    setStep: (step: number) => set({ step }),

    nextStep: () => set({ step: get().step + 1 }),

    prevStep: () => set({ step: Math.max(1, get().step - 1) }),

    resetStep: () => set({ step: 1 }),

}));
