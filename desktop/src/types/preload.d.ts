/* eslint-disable @typescript-eslint/no-explicit-any */
export {};

declare global {
  interface Window {
    hello: {
      greet: () => string;
    };
    order: {
      sendStatus: (data: {
        phone: string;
        status: string;
        summary: string;
      }) => Promise<void>;
    };
    electron: {
      store: {
        get: (key: string) => any;
        set: (key: string, value: any) => void;
        delete: (key: string) => void;
      };
    }
    whatsapp: {
      reset(): void;
      startSock(): unknown;
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
