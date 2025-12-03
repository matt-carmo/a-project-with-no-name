import { CircleAlertIcon, Home, Settings } from "lucide-react";
import { BiFoodMenu } from "react-icons/bi";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Link } from "react-router";
import { useOnlineStatus } from "@/hooks/use-online-status";
import { Alert, AlertTitle, AlertDescription } from "./ui/alert";
import { Card } from "./ui/card";
import { useAuthStore } from "@/store/auth-store";
import { Badge } from "./ui/badge";


export function AppSidebar() {
  const { selectedStore } = useAuthStore();

  const base = `/store/${selectedStore?.store.id}`;
  const { open } = useSidebar();
  const { isReachable } = useOnlineStatus();
  const { user } = useAuthStore();

  const items = [
  { title: "Home", url: base, icon: <Home /> },
  {
    title: "Cardápio",
    url: `${base}/menu`,
    icon: <BiFoodMenu className='text-2xl' />,
  },
  { title: "Settings", url: `${base}/settings`, icon: <Settings /> },
];
  const { store, role } = user?.stores?.[0] ?? {};

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className='mt-2 mb-4'>
            <Card className='p-1 gap-2 rounded-md border-accent'>
              <p className='font-semibold'>{store?.name}</p>
              <div className='flex items-center gap-2'>
                <p>{user?.name}</p>
                <Badge variant='destructive'>{role}</Badge>
              </div>
            </Card>
          </SidebarGroupLabel>
          <SidebarGroupContent className='relative'>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton>
                    <Link to={item.url} className='flex items-center gap-2'>
                      {item.icon}
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {!isReachable && (
          <div className='w-full px-2 mb-1 absolute bottom-0'>
            <Alert
              className={`p-2.5 flex flex-col gap-2 ${!open && "h-40"}`}
              variant='error'
            >
              <CircleAlertIcon />
              {open && (
                <>
                  <AlertTitle>Você está offline</AlertTitle>
                  <AlertDescription>
                    <p>Seu dispositivo não está conectado à internet.</p>
                  </AlertDescription>
                </>
              )}
              {!open && (
                <>
                  <AlertTitle className='rotate-90 text-nowrap absolute left-1/2 -translate-x-1/2 top-1/2'>
                    {" "}
                    Você está offline
                  </AlertTitle>
                </>
              )}
            </Alert>
          </div>
        )}
      </SidebarContent>
    </Sidebar>
  );
}
