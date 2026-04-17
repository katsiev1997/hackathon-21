import type { ReactNode } from "react";
import { SidebarInset, SidebarProvider } from "~/shared/components/ui/sidebar";
import { AppSidebar } from "~/widgets/sidebar/ui/app-sidebar";

type DashboardLayoutProps = {
	children: ReactNode;
};

export function DashboardLayout({ children }: DashboardLayoutProps) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset className="min-h-svh overflow-x-hidden">
				{children}
			</SidebarInset>
		</SidebarProvider>
	);
}
