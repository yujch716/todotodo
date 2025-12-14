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
import type { DailyLogType } from "@/types/daily-log.ts";
import { getDailyLogs } from "@/api/daily-log.ts";
import SidebarContentSection from "@/pages/home/sidebar/SidebarContentSection.tsx";
import SidebarFooterSection from "@/pages/home/sidebar/SidebarFooterSection.tsx";
import { useDailyLogSidebarStore } from "@/store/dailyLogSidebarStore.ts";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar.tsx";

interface Props {
  selectedId: string | null;
  onSelect: (string: string) => void;
}

const AppSidebar = ({ selectedId, onSelect }: Props) => {
  const [dailyLogs, setDailyLogs] = useState<DailyLogType[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const refreshSidebar = useDailyLogSidebarStore(
    (state) => state.refreshSidebar,
  );
  const resetSidebarRefresh = useDailyLogSidebarStore(
    (state) => state.resetSidebarRefresh,
  );

  const loadDailyLogs = async () => {
    const data = await getDailyLogs();
    setDailyLogs(data);
  };

  useEffect(() => {
    loadDailyLogs();
  }, []);

  useEffect(() => {
    if (refreshSidebar) {
      loadDailyLogs();
      resetSidebarRefresh();
    }
  }, [refreshSidebar, resetSidebarRefresh]);

  const handleSelect = (id: string) => {
    onSelect(id);
  };

  return (
    <Sidebar
      side="left"
      variant="inset"
      collapsible="icon"
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 to-sky-100" />
      <SidebarHeader className="bg-transparent flex flex-row items-center gap-2 px-3 py-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-row gap-2">
            <SidebarMenuButton className="h-auto px-0 bg-transparent hover:bg-transparent cursor-default focus:bg-transparent active:bg-transparent focus-visible:ring-0 focus-visible:outline-none">
              <Avatar className="rounded-lg w-10 h-10 bg-white p-1 border border-slate-500">
                <AvatarImage src="/todotodo-logo.png" alt="todotodo logo" />
                <AvatarFallback>
                  <img src="/todotodo-logo.png" alt="todotodo logo" />
                </AvatarFallback>
              </Avatar>
              <h1 className="text-base font-medium">todotodo</h1>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent className="bg-transparent">
        <SidebarContentSection
          dailyLogState={{ dailyLogs, selectedId, isOpen }}
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
