import { Skeleton } from "@/components/ui/skeleton";
import { useWhatsAppStore } from "@/store/useWhatsAppStore";

import QRCode from "react-qr-code";
export default function SettingsPage() {
  const { qr, status } = useWhatsAppStore();

  if (status == "connected") return <div>Você já está conectado</div>;
  return (
    <div className='p-2'>
      {(qr?.length ?? 0) < 1 && <Skeleton className="aspect-square w-sm" />}
      <div className='max-w-sm'>{qr && <QRCode className="bg-zinc-900 p-1" value={qr} />}</div>
    </div>
  );
}
