// import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app.sidebar";
import { Badge } from "@/components/ui/badge";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useWhatsAppStore } from "@/store/useWhatsAppStore";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

import { AnchoredToastProvider, ToastProvider } from "@/components/ui/toast";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Wifi, WifiOff } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Layout() {
  const { status, setStatus } = useWhatsAppStore();
  const { isReachable } = useOnlineStatus();

  useEffect(() => {
    window.whatsapp.startSock();

    window.whatsapp.onStatus((data) => {
      if (data.status) {
        setStatus(data.status, data.data);
      }
    });
  }, []);

  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <ToastProvider>
          <AnchoredToastProvider>
            <main className="grid grid-rows-[auto_1fr_auto] flex-1 h-screen  overflow-hidden">
              <div className="flex items-center p-2 ">
                <SidebarTrigger />
                {process.env.NODE_ENV !== "production" && (
                  <div className="p-2 bg-yellow-500 text-black rounded flex ml-4">
                    <strong>Warning:</strong> You are running in development
                    mode.
                  </div>
                )}
                {/* <header>HEADER</header> */}
              </div>
              <ScrollArea>
                {/* <div className='container p-5 h-full'> */}
                <div className="p-5 h-full">
                  <Outlet />
                </div>
              </ScrollArea>
              <div className="p-2 bg-zinc-900 flex items-center gap-2">
                <div className="mb-1">
                  {isReachable ? (
                    <Wifi className="text-green-500 w-5" />
                  ) : (
                    <WifiOff className="text-red-500 w-5" />
                  )}
                </div>
                {isReachable && (
                  <>
                    {status === "idle" && (
                      <Badge variant="info">
                        <div className="relative w-2 h-2">
                          <span className="w-2 h-2 bg-gray-500 rounded-full absolute"></span>
                          <span className="w-2 h-2 bg-gray-500 rounded-full animate-ping absolute"></span>
                        </div>
                        <span>
                          <span>Carregando...</span>
                        </span>
                      </Badge>
                    )}
                    {status === "connected" && (
                      <Badge variant="success">
                        <div className="relative w-2 h-2">
                          <span className="w-2 h-2 bg-green-500 rounded-full absolute"></span>
                          <span className="w-2 h-2 bg-green-500 rounded-full animate-ping absolute"></span>
                        </div>
                        <span>Conectado</span>
                      </Badge>
                    )}
                    {status === "connecting" && (
                      <Badge variant="success">
                        <div className="relative w-2 h-2">
                          <span className="w-2 h-2 bg-yellow-500 rounded-full absolute"></span>
                          <span className="w-2 h-2 bg-yellow-500 rounded-full animate-ping absolute"></span>
                        </div>
                        <span>Conectando</span>
                      </Badge>
                    )}
                    {status === "disconnected" && (
                      <Badge variant="info">
                        <div className="relative w-2 h-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full absolute"></span>
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute"></span>
                        </div>
                        <span>Desconectado</span>
                      </Badge>
                    )}
                    {status === "qr" && (
                      <Badge variant="info">
                        <div className="relative w-2 h-2">
                          <span className="w-2 h-2 bg-red-500 rounded-full absolute"></span>
                          <span className="w-2 h-2 bg-red-500 rounded-full animate-ping absolute"></span>
                        </div>
                        <span>
                          Desconectado{" "}
                          <Link to="settings">
                            <Button variant={"link"}>
                              clique aqui para scanear o QR code
                            </Button>
                          </Link>
                        </span>
                      </Badge>
                    )}
                  </>
                )}
              </div>
            </main>
          </AnchoredToastProvider>
        </ToastProvider>
      </SidebarProvider>
    </>
  );
}
