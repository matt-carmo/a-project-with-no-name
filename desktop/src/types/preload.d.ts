/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    hello: {
      greet: () => string;
    };
    whatsapp: {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: any;
      onStatus: (callback: (data: { status: "idle" | "connecting" | "qr" | "connected" | "disconnected"; data?: any }) => void) => void;
    };
  }
  interface whatsapp {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    data: any;
    onStatus: (callback: (data: { status: string; data?: any }) => void) => void;
  }
}
