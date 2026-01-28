import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { NavUser } from "./nav-user";
import { ThemeSwitcher } from "./theme-switcher";
import type { User } from "@/utils/users/service";

export function AppSidebar({ user }: { user: User | null }) {
  const userData = user
    ? {
        name:
          (user.user_metadata?.display_name as string) ||
          user.email?.split("@")[0] ||
          "User",
        email: user.email || "",
      }
    : { name: "Guest", email: "" };

  return (
    <Sidebar variant="floating">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/">
                <span className="text-base font-semibold">
                  Sport Event Manager
                </span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent />
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <ThemeSwitcher />
          </SidebarMenuItem>
        </SidebarMenu>
        <NavUser user={userData} />
      </SidebarFooter>
    </Sidebar>
  );
}
