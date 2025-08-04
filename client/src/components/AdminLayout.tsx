import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import SyncStatus from "./SyncStatus";
import { useAuthSync } from "@/hooks/useDataSync";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { user } = useAuthSync();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AdminSidebar />
        
        <div className="flex-1 flex flex-col">
          {/* Enhanced Header with Sync Status */}
          <header className="h-14 flex items-center justify-between border-b bg-card px-4">
            <div className="flex items-center space-x-4">
              <SidebarTrigger />
              <div>
                <h1 className="text-lg font-semibold text-foreground">Admin Control Panel</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <SyncStatus />
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">
                  {user?.role === 'super_admin' ? 'Super Admin' : 'Admin'} - {user?.email}
                </span>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}