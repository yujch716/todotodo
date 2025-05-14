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
import { List, LogOut, MoreHorizontal, Plus } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/lib/supabaseClient.ts";

interface Props {
  checklists: Checklist[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onAddChecklist: (title: string) => void;
}

export default function HomeSidebar({
  checklists,
  selectedId,
  onSelect,
  onAddChecklist,
}: Props) {
  const [hovered, setHovered] = useState(false);

  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}년 ${month}월 ${day}일`;
  };

  const handleAddChecklist = () => {
    const title = getTodayDate();
    onAddChecklist(title);
  };

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
            <Plus onClick={handleAddChecklist} />{" "}
            <span className="sr-only">Add Checklist</span>
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
