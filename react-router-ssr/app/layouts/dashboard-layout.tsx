import { Loader2 } from "lucide-react";
import type { ReactNode } from "react";
import { Navigate } from "react-router";
import { useGetProfile } from "~/entities/user";
import { SidebarInset, SidebarProvider } from "~/shared/components/ui/sidebar";
import { AppSidebar } from "~/widgets/sidebar/ui/app-sidebar";

type DashboardLayoutProps = {
  children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { data, isLoading } = useGetProfile();

  if (isLoading) {
    return (
      <div className="flex h-svh items-center justify-center">
        <Loader2 className="size-10 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return <Navigate to="/" replace />;
  }

  return (
    <SidebarProvider>
      <AppSidebar user={data} />
      <SidebarInset className="min-h-svh overflow-x-hidden">{children}</SidebarInset>
    </SidebarProvider>
  );
}
