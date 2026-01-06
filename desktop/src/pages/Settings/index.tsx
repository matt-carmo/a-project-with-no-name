import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWhatsAppStore } from "@/store/useWhatsAppStore";
import { LogOut } from "lucide-react";
import { MdWhatsapp } from "react-icons/md";
import QRCode from "react-qr-code";

export default function SettingsPage() {
  const { qr, status } = useWhatsAppStore();

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 ">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 ">
        {/* Header */}
        <div className="mb-6 text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <MdWhatsapp className="text-green-600 w-7 h-7" />
            <h1 className="text-xl font-semibold text-green-600">WhatsApp</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Conecte sua conta para habilitar mensagens automáticas
          </p>
        </div>

        {/* CONNECTED */}
        {status === "connected" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 rounded-lg border border-green-200 bg-green-50 p-4">
              <MdWhatsapp className="text-green-600 w-6 h-6" />
              <div>
                <p className="font-medium text-green-800">
                  WhatsApp conectado
                </p>
                <p className="text-sm text-green-700">
                  Sua sessão está ativa
                </p>
              </div>
            </div>

            <Button
              variant="secondary"
            className="w-full"
              type="button"
              onClick={async () => {
                try {
                  await window.whatsapp.reset();
                } catch (error) {
                  console.error("Erro ao resetar conexão:", error);
                }
              }}
            >
              <LogOut className="h-4 w-4" />
              Desconectar
            </Button>
          </div>
        )}

        {/* NOT CONNECTED */}
        {status !== "connected" && (
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-muted-foreground text-center">
              Escaneie o QR Code com o WhatsApp para conectar
            </p>

            <div className="flex items-center justify-center rounded-lg p-2 ">
              {qr ? (
                <QRCode value={qr} size={300} className="p-2 bg-zinc-100 rounded-sm" />
              ) : (
                <Skeleton className="h-[300px] w-[300px] rounded-md" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
