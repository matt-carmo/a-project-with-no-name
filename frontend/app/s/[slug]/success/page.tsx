"use client";

import { CheckCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuthStore } from "@/store/auth-store";
import Link from "next/link";

export default function SuccessPage() {
  const {selectedStore} = useAuthStore();
  
  const WHATSAPP_MESSAGE =
  "Olá! Gostaria de acompanhar o status do meu pedido.";

    const whatsappLink = `https://wa.me/${selectedStore?.store.phoneNumber}?text=${encodeURIComponent(
    WHATSAPP_MESSAGE
  )}`;

  return (
     <div className="min-h-screen flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center space-y-6">
        <CheckCircle2 className="mx-auto h-16 w-16 text-green-500" />

        <h1 className="text-2xl font-bold">
          Pedido realizado com sucesso!
        </h1>

        <p className="text-muted-foreground">
          Obrigado pelo seu pedido 🙌  
          Ele já foi recebido e está sendo processado.
        </p>

        <p className="text-muted-foreground">
          Acompanhe o status do seu pedido pelo WhatsApp.
        </p>

        <div className="space-y-3 pt-4">
            <Link
              href={whatsappLink}
              target="_blank"
              className="flex gap-x-2 items-center"
              rel="noopener noreferrer"
            >
          <Button className="w-full gap-2">
              <MessageCircle className="h-4 w-4" />
              Acompanhar pelo WhatsApp
          </Button>
            </Link>

            <Link href={`/s/${selectedStore?.store.slug}`}>
          <Button variant="outline" className="w-full">
              Voltar para a página inicial
          </Button>
            </Link>
        </div>
      </div>
    </div>
  );
}
