import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWhatsAppStore } from "@/store/useWhatsAppStore";

import QRCode from "react-qr-code";
export default function SettingsPage() {
  const { qr, status } = useWhatsAppStore();

  return (
    <>
      <Button
        variant={"destructive"}
        className="mb-2"
        onClick={() => window.whatsapp.reset()}
      >
        Resetar conexão
      </Button>
      {status === "connected" && (
        <div className="p-2">
          <p className="mb-2">WhatsApp está conectado!</p>
        </div>
      )}
      {status !== "connected" && (
        <div className="p-2">
          <div className="max-w-sm">
            {qr && <QRCode className="bg-zinc-200 p-1" value={qr} />}
          </div>
          {(qr?.length ?? 0) < 1 && <Skeleton className="aspect-square w-sm" />}
        </div>
      )}
    </>
  );
}
