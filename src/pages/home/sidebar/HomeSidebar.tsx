import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient.ts";
import CreateChecklistModal from "@/pages/home/checklist/CreateChecklistModal.tsx";
import type { ChecklistType } from "@/types/checklist.ts";
import UserMenu from "@/pages/home/sidebar/UserMenu.tsx";
import ChecklistCollapsible from "@/pages/home/sidebar/ChecklistCollapsible.tsx";

interface Props {
  selectedId: string | null;
  onSelect: (string: string) => void;
}

const HomeSidebar = ({ selectedId, onSelect }: Props) => {
  const [checklists, setChecklists] = useState<ChecklistType[]>([]);
  const [isOpen, setIsOpen] = useState(true);

  const fetchChecklists = useCallback(async () => {
    const { data, error } = await supabase
      .from("checklist")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("checklist 불러오기 오류:", error);
      return;
    }

    setChecklists(data || []);

    if (!selectedId && data && data.length > 0) {
      onSelect(data[0].id);
    }
  }, [onSelect, selectedId]);

  useEffect(() => {
    fetchChecklists();
  }, [fetchChecklists]);

  return (
    <Sidebar side="left" variant="sidebar" collapsible="icon">
      <SidebarHeader className="bg-slate-100">
        <SidebarMenu>
          <SidebarMenuItem>
            <UserMenu />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-slate-100">
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
            <SidebarMenu>
              <ChecklistCollapsible
                checklists={checklists}
                selectedId={selectedId}
                onSelect={onSelect}
                isOpen={isOpen}
                onOpenChange={setIsOpen}
              />
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="bg-slate-100" />
    </Sidebar>
  );
};

export default HomeSidebar;
