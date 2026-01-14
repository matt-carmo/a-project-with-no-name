import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useWhatsAppStore } from "@/store/useWhatsAppStore";
import { useAuthStore } from "@/store/auth-store";
import { LogOut, Store } from "lucide-react";
import { MdWhatsapp } from "react-icons/md";
import QRCode from "react-qr-code";
import { useEffect, useState } from "react";
import { getStoreSettings, updateStoreSettings, type StoreSettings } from "@/services/store-settings.service";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { qr, status } = useWhatsAppStore();
  const { selectedStore } = useAuthStore();
  const [storeSettings, setStoreSettings] = useState<StoreSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    if (selectedStore?.store.id) {
      loadStoreSettings();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedStore?.store.id]);

  const loadStoreSettings = async () => {
    if (!selectedStore?.store.id) return;
    
    try {
      setIsLoading(true);
      const settings = await getStoreSettings(selectedStore.store.id);
      setStoreSettings(settings);
    } catch (error) {
      console.error("Erro ao carregar configurações da loja:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleStoreStatus = async (checked: boolean) => {
    if (!selectedStore?.store.id || isUpdating) return;

    try {
      setIsUpdating(true);
      const updated = await updateStoreSettings(selectedStore.store.id, {
        isOpen: checked,
      });
      setStoreSettings(updated);
    } catch (error) {
      console.error("Erro ao atualizar status da loja:", error);
      // Revert the change on error
      await loadStoreSettings();
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] items-center justify-center p-4 ">
      <div className="w-full max-w-md rounded-xl bg-zinc-900 p-6 space-y-6">
        {/* Store Status Section */}
        <div className="space-y-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Store className="text-blue-600 w-7 h-7" />
              <h1 className="text-xl font-semibold text-blue-600">Status da Loja</h1>
            </div>
            <p className="text-sm text-muted-foreground">
              Controle se a loja está aberta ou fechada
            </p>
          </div>

          {isLoading ? (
            <div className="flex items-center justify-center p-4">
              <Skeleton className="h-10 w-full" />
            </div>
          ) : (
            <div className="flex items-center justify-between rounded-lg border border-zinc-700 bg-zinc-800 p-4">
              <div className="flex flex-col">
                <p className="font-medium text-white">
                  {storeSettings?.isOpen ? "Loja Aberta" : "Loja Fechada"}
                </p>
                <p className="text-sm text-muted-foreground">
                  {storeSettings?.isOpen
                    ? "A loja está recebendo pedidos"
                    : "A loja não está recebendo pedidos"}
                </p>
              </div>
              <Switch
                checked={storeSettings?.isOpen ?? false}
                onCheckedChange={handleToggleStoreStatus}
                disabled={isUpdating}
              />
            </div>
          )}
        </div>

        <Separator className="bg-zinc-700" />

        {/* WhatsApp Section */}
        <div>
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
    </div>
  );
}
