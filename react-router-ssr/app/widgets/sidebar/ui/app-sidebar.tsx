import { Kanban, LayoutDashboard, Lightbulb, Search, Trophy, User, Users } from "lucide-react";
import type { ProfileResponse } from "~/entities/user/model/api/profile";
import { UserInfo } from "~/entities/user/ui/user-info";
import { ScrollArea } from "~/shared/components/ui/scroll-area";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarSeparator,
} from "~/shared/components/ui/sidebar";
import { NavItem } from "~/widgets/sidebar/ui/nav-item";

/** Пути относительно вложенного маршрута `/dashboard` (см. wouter `nest`). */
const NAV_PRIMARY: {
  href: string;
  label: string;
  icon: typeof Search;
}[] = [
  { href: "/dashboard", label: "Find Team Board", icon: Search },
  {
    href: "/dashboard/participants",
    label: "Participants",
    icon: Users,
  },
  { href: "/dashboard/teams", label: "Teams Dashboard", icon: LayoutDashboard },
  { href: "/dashboard/ideas", label: "Ideas & Voting", icon: Lightbulb },
  { href: "/dashboard/kanban", label: "Kanban Board", icon: Kanban },
  { href: "/dashboard/leaderboard", label: "Leaderboard", icon: Trophy },
  { href: "/dashboard/profile", label: "User Profile", icon: User },
];

type AppSidebarProps = {
  user: ProfileResponse;
};

export function AppSidebar({ user }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" variant="sidebar">
      <SidebarHeader className="gap-3 px-4 py-4">
        <div className="flex items-center gap-2 px-1">
          <div className="flex size-8 items-center justify-center rounded-lg bg-primary/15 text-sm font-bold text-primary">
            H
          </div>
          <span className="font-heading text-lg font-semibold tracking-tight">HackForge</span>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <ScrollArea className="h-[calc(100svh-8rem)]">
          <SidebarGroup>
            <SidebarGroupLabel>Menu</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {NAV_PRIMARY.map((item) => (
                  <NavItem key={item.href} href={item.href} label={item.label} icon={item.icon} />
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </ScrollArea>
      </SidebarContent>
      <SidebarFooter className="border-t border-sidebar-border p-2">
        <UserInfo user={user} />
      </SidebarFooter>
    </Sidebar>
  );
}
