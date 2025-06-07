import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { useEffect, useState } from "react";
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
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchChecklists();
      setChecklists(data);
    };

    fetchData();
  }, []);

  return (
    <Sidebar side="left" variant="inset" collapsible="icon">
      <SidebarHeader className="bg-sky-100 flex flex-row items-center gap-2 px-3 py-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row gap-2">
            <SidebarMenuButton className="px-0 bg-transparent hover:bg-transparent cursor-default focus:bg-transparent active:bg-transparent focus-visible:ring-0 focus-visible:outline-none">
              <img
                src="/todotodo-logo.png"
                alt="todotodo logo"
                className="w-6 h-6"
              />
              <h1 className="text-base font-medium">todotodo</h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-sky-100">
        <SidebarContentSection
          checklistState={{ checklists, selectedId, isOpen }}
          onSelect={handleSelect}
          onOpenChange={setIsOpen}
        />
      </SidebarContent>

      <SidebarFooter className="bg-sky-100">
        <SidebarFooterSection />
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
