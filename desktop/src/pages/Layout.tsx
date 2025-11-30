// import { Sidebar } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app.sidebar";
import { Badge } from "@/components/ui/badge";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { useWhatsAppStore } from "@/store/useWhatsAppStore";
import { Button } from "@/components/ui/button";

import { useEffect } from "react";
import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  const { status, setStatus } = useWhatsAppStore();
  useEffect(() => {
    // window.api.startQR();
    window.whatsapp.onStatus((data) => {
      setStatus(data.status, data.data);
    });
  }, []);
  console.log("status", status);
  return (
    <SidebarProvider>
      <AppSidebar />
      <main className='flex-1 overflow-hidden justify-between flex flex-col'>
        <div>
          <SidebarTrigger />
          <Outlet />
        </div>
        <div className='p-2 bg-zinc-900'>
          {status === "connected" && (
            <Badge variant='success'>
              <div className='relative w-2 h-2'>
                <span className='w-2 h-2 bg-green-500 rounded-full absolute'></span>
                <span className='w-2 h-2 bg-green-500 rounded-full animate-ping absolute'></span>
              </div>
              <span>Conectado</span>
            </Badge>
          )}
          {status === "connecting" && (
            <Badge variant='success'>
              <div className='relative w-2 h-2'>
                <span className='w-2 h-2 bg-yellow-500 rounded-full absolute'></span>
                <span className='w-2 h-2 bg-yellow-500 rounded-full animate-ping absolute'></span>
              </div>
              <span>Conectando</span>
            </Badge>
          )}
           {status === "disconnected" && (
            <Badge variant='info'>
              <div className='relative w-2 h-2'>
                <span className='w-2 h-2 bg-red-500 rounded-full absolute'></span>
                <span className='w-2 h-2 bg-red-500 rounded-full animate-ping absolute'></span>
              </div>
              <span>Desconectado</span>
            </Badge>
          )}
           {status === "qr" && (
            <Badge variant='info'>
              <div className='relative w-2 h-2'>
                <span className='w-2 h-2 bg-red-500 rounded-full absolute'></span>
                <span className='w-2 h-2 bg-red-500 rounded-full animate-ping absolute'></span>
              </div>
              <span>Desconectado <Link  to="/settings"><Button variant={"link"}>clique aqui para scanear o QR code</Button></Link></span>
            </Badge>
          )}
        </div>
      </main>
    </SidebarProvider>
  );
}
