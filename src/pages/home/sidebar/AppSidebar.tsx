import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar.tsx";
import { useCallback, useEffect, useState } from "react";
import type { ChecklistType } from "@/types/checklist.ts";
import { fetchChecklists } from "@/api/checklist.ts";
import SidebarContentSection from "@/pages/home/sidebar/SidebarContentSection.tsx";
import SidebarFooterSection from "@/pages/home/sidebar/SidebarFooterSection.tsx";

interface Props {
  selectedId: string | null;
  onSelect: (string: string) => void;
}

const AppSidebar = ({ selectedId, onSelect }: Props) => {
  const [checklists, setChecklists] = useState<ChecklistType[]>([]);
  const [isOpen, setIsOpen] = useState(true);

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
      <SidebarHeader className="bg-sky-100 flex flex-row items-center gap-2 px-3 py-2">
        <img src="/todotodo-logo.png" alt="todotodo logo" className="w-6 h-6" />
        <h1 className="text-base font-medium">todotodo</h1>
      </SidebarHeader>

      <SidebarContent className="bg-sky-100">
        <SidebarContentSection
          checklistState={{ checklists, selectedId, isOpen }}
          onSelect={handleSelect}
          onOpenChange={setIsOpen}
          onReload={loadChecklists}
        />
      </SidebarContent>

      <SidebarFooter className="bg-sky-100">
        <SidebarFooterSection />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
