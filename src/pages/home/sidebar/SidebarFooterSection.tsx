import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar.tsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { ChevronsUpDown, LogOut } from "lucide-react";
import { logout } from "@/api/auth.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";
import { getUser } from "@/api/user.ts";
import { useEffect, useState } from "react";
import type { UserProfile } from "@/types/user.ts";
import UserProfileModal from "@/pages/home/sidebar/UserProfileModal.tsx";

const SidebarFooterSection = () => {
  const { isMobile } = useSidebar();
  const [user, setUser] = useState<UserProfile | null>(null);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      console.error("Logout error:", error.message);
      return;
    }
    window.location.href = "/login";
  };

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getUser();
      setUser({
        name: user?.user_metadata?.name ?? "사용자",
        email: user?.email ?? "",
        avatar_url: user?.user_metadata?.picture ?? "",
      });
    };
    fetchUser();
  }, []);

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground rounded-lg border-2 border-sky-200 hover:bg-sky-50"
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage src={user?.avatar_url} alt={user?.name} />
                <AvatarFallback className="rounded-lg">
                  <img src="/images/avatar/cat.png" alt="todotodo logo" />
                </AvatarFallback>
              </Avatar>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{user?.name}</span>
                <span className="text-muted-foreground truncate text-xs">
                  {user?.email}
                </span>
              </div>
              <ChevronsUpDown className="ml-auto size-4" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>
          <DropdownMenuContent side={isMobile ? "bottom" : "right"} align="end">
            <DropdownMenuGroup>
              <UserProfileModal />
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
};

export default SidebarFooterSection;
