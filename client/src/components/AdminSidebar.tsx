import { NavLink, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  ShoppingCart,
  Menu,
  BarChart3,
  Bell,
  CreditCard,
  FileText,
  Settings,
  UserPlus,
  TrendingUp,
  Package,
  MessageSquare,
  Shield,
  Database,
  Globe,
  Star,
  Clock,
  DollarSign
} from "lucide-react";

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

const mainItems = [
  { title: "Overview", url: "/admin", icon: LayoutDashboard },
  { title: "Analytics", url: "/admin/analytics", icon: TrendingUp },
  { title: "Reports", url: "/admin/reports", icon: BarChart3 },
];

const managementItems = [
  { title: "User Management", url: "/admin/user-management", icon: Users },
  { title: "Order Management", url: "/admin/order-management", icon: ShoppingCart },
  { title: "Menu Management", url: "/admin/menu-management", icon: Menu },
  { title: "Payment Management", url: "/admin/payment-management", icon: CreditCard },
  { title: "Notification Management", url: "/admin/notification-management", icon: Bell },
];

const contentItems = [
  { title: "Content Management", url: "/admin/content-management", icon: FileText },
  { title: "Home Content Editor", url: "/admin/home-content", icon: Globe },
  { title: "Feedback Management", url: "/admin/feedback-management", icon: MessageSquare },
  { title: "Review Management", url: "/admin/review-management", icon: Star },
];

const systemItems = [
  { title: "System Settings", url: "/admin/system-settings", icon: Settings },
  { title: "Admin Access", url: "/admin/admin-access", icon: Shield },
  { title: "Database Management", url: "/admin/database", icon: Database },
];

export function AdminSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  const currentPath = location.pathname;
  const collapsed = state === "collapsed";

  const isActive = (path: string) => currentPath === path;
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    `flex items-center space-x-3 px-3 py-2 rounded-lg transition-colors ${
      isActive ? "bg-primary text-primary-foreground font-medium" : "hover:bg-muted/50"
    }`;

  const renderMenuGroup = (items: typeof mainItems, label: string) => (
    <SidebarGroup>
      <SidebarGroupLabel>{!collapsed && label}</SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink 
                  to={item.url} 
                  className={({ isActive }) => getNavCls({ isActive })}
                >
                  <item.icon className="h-4 w-4" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar className={collapsed ? "w-14" : "w-64"} collapsible="icon">
      <SidebarContent className="py-4">
        {renderMenuGroup(mainItems, "Dashboard")}
        {renderMenuGroup(managementItems, "Management")}
        {renderMenuGroup(contentItems, "Content")}
        {renderMenuGroup(systemItems, "System")}
      </SidebarContent>
    </Sidebar>
  );
}