import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
} from "@/components/ui/sidebar.tsx";
import type { Checklist } from "@/types/checklist.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu.tsx";
import {
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@radix-ui/react-dropdown-menu";
import { List, LogOut, MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient.ts";
import CreateChecklistModal from "@/components/CreateChecklistModal.tsx";

interface Props {
  checklists: Checklist[];
  selectedId: number | null;
  onSelect: (id: number) => void;
}

export default function HomeSidebar({
  checklists,
  selectedId,
  onSelect,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    window.location.href = "/login";

    if (error) {
      console.error("Error logging out:", error.message);
    }
  };

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="bg-slate-100">
        <SidebarMenu>
          <SidebarMenuItem>
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
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-slate-100">
        <SidebarGroup>
          <SidebarGroupLabel>Add Checklist</SidebarGroupLabel>
          <SidebarGroupAction title="Add Project">
            <CreateChecklistModal />
          </SidebarGroupAction>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>
            <List /> Checklist
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {checklists.map((item) => (
                <SidebarMenuItem key={item.id}>
                  <SidebarMenuButton asChild>
                    <button
                      className={`w-full justify-start
                        ${item.id === selectedId ? "bg-slate-600 text-white" : ""}
                        hover:bg-slate-300
                      `}
                      onClick={() => onSelect(item.id)}
                    >
                      {item.title}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-slate-100" />
    </Sidebar>
  );
}
