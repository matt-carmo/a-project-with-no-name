/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from "zustand";

interface WhatsAppState {
  status: "idle" | "connecting" | "qr" | "connected" | "disconnected";
  qr?: string | null;
  error?: number | null;
  setStatus: (status: WhatsAppState["status"], data?: any) => void;
}

export const useWhatsAppStore = create<WhatsAppState>((set) => ({
  status: "idle",
  qr: null,
  error: null,
  setStatus: (status, data) =>
    set(() => ({
      status,
      qr: status === "qr" ? data : null,
      error: status === "disconnected" ? data : null,
    })),
}));
