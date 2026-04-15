import type { LucideIcon } from "lucide-react";
import { Link, useLocation } from "wouter-preact";
import {
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";

type NavItemProps = {
  href: string;
  label: string;
  icon: LucideIcon;
};

export function NavItem({ href, label, icon: Icon }: NavItemProps) {
  const [location] = useLocation();
  const isActive = location === href;

  return (
    <SidebarMenuItem>
      <SidebarMenuButton asChild isActive={isActive} tooltip={label}>
        <Link href={href} className="flex items-center gap-2">
          <Icon />
          <span>{label}</span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
