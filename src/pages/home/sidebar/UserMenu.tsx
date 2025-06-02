import { SidebarMenuAction, SidebarTrigger } from "@/components/ui/sidebar.tsx";
import { LogOut, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { logout } from "@/api/auth.ts";

const UserMenu = () => {
  const [hovered, setHovered] = useState(false);

  const handleLogout = async () => {
    const { error } = await logout();
    if (error) {
      console.error("Logout error:", error.message);
      return;
    }
    window.location.href = "/login";
  };

  return (
    <>
      <SidebarTrigger
        hovered={hovered}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <SidebarMenuAction>
            <MoreHorizontal />
          </SidebarMenuAction>
        </DropdownMenuTrigger>
        <DropdownMenuContent side="right" align="start">
          <DropdownMenuItem>
            <span>Setting</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut /> Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default UserMenu;
