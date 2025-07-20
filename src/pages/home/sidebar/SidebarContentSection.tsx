import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Calendar } from "lucide-react";
import CreateDailyLogModal from "@/pages/daily-log/CreateDailyLogModal.tsx";
import DailyLogCollapsible from "@/pages/home/sidebar/DailyLogCollapsible.tsx";
import { useNavigate } from "react-router-dom";
import type { DailyLogType } from "@/types/daily-log.ts";

interface DailyLogState {
  dailyLogs: DailyLogType[];
  selectedId: string | null;
  isOpen: boolean;
}

interface Props {
  dailyLogState: DailyLogState;
  onSelect: (id: string) => void;
  onOpenChange: (open: boolean) => void;
}

const SidebarContentSection = ({
  dailyLogState,
  onSelect,
  onOpenChange,
}: Props) => {
  const { dailyLogs, selectedId, isOpen } = dailyLogState;
  const navigate = useNavigate();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <CreateDailyLogModal />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="my-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                onClick={() =>
                  navigate(
                    { pathname: "/calendar", search: "" },
                    { replace: true },
                  )
                }
                className="flex items-center gap-2 hover:bg-sky-200"
              >
                <Calendar className="w-4 h-4" />
                <span>Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <DailyLogCollapsible
              dailyLogs={dailyLogs}
              selectedId={selectedId}
              onSelect={onSelect}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            />
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default SidebarContentSection;
