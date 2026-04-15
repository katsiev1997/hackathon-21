import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "~/shared/components/ui/sidebar";

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const { pathname } = useLocation();
  const isActive = pathname === href;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link to={href} className="flex items-center gap-2 mt-0.5">
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
