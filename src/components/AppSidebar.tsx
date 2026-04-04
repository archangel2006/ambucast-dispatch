import {
  LayoutDashboard, MapPin, ShieldAlert, Truck, Map, BarChart3, Settings, Siren,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu,
  SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const items = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard },
  { title: "Hotspot Prediction", url: "/hotspot", icon: MapPin },
  { title: "Risk Analysis", url: "/risk", icon: ShieldAlert },
  { title: "Fleet Optimization", url: "/fleet", icon: Truck },
  { title: "Live Map", url: "/map", icon: Map },
  { title: "Analytics", url: "/analytics", icon: BarChart3 },
  { title: "Settings", url: "/settings", icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <div className={`px-4 py-5 flex items-center gap-3 border-b border-sidebar-border ${collapsed ? 'justify-center px-2' : ''}`}>
          <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center glow-blue shrink-0">
            <Siren className="h-4 w-4 text-primary" />
          </div>
          {!collapsed && (
            <div>
              <h1 className="text-sm font-bold text-foreground tracking-wide">AmbuCast</h1>
              <p className="text-[10px] text-muted-foreground">Smart Dispatch System</p>
            </div>
          )}
        </div>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink
                      to={item.url}
                      end={item.url === "/"}
                      className="hover:bg-sidebar-accent/50 transition-colors"
                      activeClassName="bg-sidebar-accent text-primary font-medium glow-blue"
                    >
                      <item.icon className="mr-2 h-4 w-4 shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
