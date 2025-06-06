import { SidebarMenuAction } from "@/components/ui/sidebar.tsx";
import { LogOut, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu.tsx";
import { logout } from "@/api/auth.ts";

const UserMenu = () => {
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
      <h1 className="text-base font-medium">todotodo</h1>
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
