import {
  CircleAlertIcon,
  Home,
  Settings,
} from "lucide-react";
import {
  BiFoodMenu 
} from "react-icons/bi";
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

// Menu items.
const items = [
  {
    title: "Home",
    url: "/",
    icon: <Home/>,
  },
  {
    title: "Cardápio",
    url: "/menu",
    icon: <BiFoodMenu className="text-2xl" />
  },
  // {
  //   title: "Calendar",
  //   url: "#",
  //   icon: Calendar,
  // },
  // {
  //   title: "Search",
  //   url: "#",
  //   icon: Search,
  // },
  {
    title: "Settings",
    url: "/settings",
    icon: <Settings/>,
  },
];

export function AppSidebar() {
  const { open } = useSidebar();
  const { isReachable } = useOnlineStatus();

  return (
    <Sidebar collapsible='icon'>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
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
