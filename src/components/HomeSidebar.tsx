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
} from "@/components/ui/sidebar.tsx";
import type { Checklist } from "@/types/checklist.ts";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu.tsx";
import { DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { List, MoreHorizontal, Plus } from "lucide-react";

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

  return (
    <Sidebar
      side="left"
      variant="sidebar"
      collapsible="icon"
      className={"bg-slate-800"}
    >
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <span>🔫 todotodo</span>
            </SidebarMenuButton>
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
                <DropdownMenuItem>
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
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
                        ${item.id === selectedId ? "bg-slate-700 text-white" : ""}
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

      <SidebarFooter />
    </Sidebar>
  );
}
