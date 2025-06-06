import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useCallback, useEffect, useState } from "react";
import CreateChecklistModal from "@/pages/home/checklist/CreateChecklistModal.tsx";
import type { ChecklistType } from "@/types/checklist.ts";
import UserMenu from "@/pages/home/sidebar/UserMenu.tsx";
import ChecklistCollapsible from "@/pages/home/sidebar/ChecklistCollapsible.tsx";
import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { fetchChecklists } from "@/api/checklist.ts";

interface Props {
  selectedId: string | null;
  onSelect: (string: string) => void;
}

const AppSidebar = ({ selectedId, onSelect }: Props) => {
  const [checklists, setChecklists] = useState<ChecklistType[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const navigate = useNavigate();

  const loadChecklists = useCallback(async () => {
    const data = await fetchChecklists();
    setChecklists(data);
  }, []);

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  useEffect(() => {
    loadChecklists();
  }, [loadChecklists]);

  return (
    <Sidebar side="left" variant="inset" collapsible="icon">
      <SidebarHeader className="bg-sky-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-sky-100">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <CreateChecklistModal onCreated={fetchChecklists} />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="my-1">
              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={() => {
                    navigate(
                      {
                        pathname: "/calendar",
                        search: "",
                      },
                      { replace: true },
                    );
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Calendar</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>

            <SidebarMenu className="my-1">
              <ChecklistCollapsible
                checklists={checklists}
                selectedId={selectedId}
                onSelect={handleSelect}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-sky-100" />
    </Sidebar>
  );
};

export default AppSidebar;
