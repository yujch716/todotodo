import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Calendar, Flag, Settings } from "lucide-react";
import DailyLogCollapsible from "@/pages/home/sidebar/DailyLogCollapsible.tsx";
import { useLocation, useNavigate } from "react-router-dom";
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
  const location = useLocation();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupLabel>Application</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu className="my-1 gap-1">
            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname === "/calendar"}
                onClick={() => navigate("/calendar", { replace: true })}
                className="h-auto min-h-9 p-3 flex items-center gap-3 hover:bg-sky-200 [&_svg]:size-auto data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:border-l-4 data-[active=true]:border-sky-300"
              >
                <Calendar className="w-12 h-12 shrink-0" />
                <span className="text-base">Calendar</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <DailyLogCollapsible
              dailyLogs={dailyLogs}
              selectedId={selectedId}
              onSelect={onSelect}
              isOpen={isOpen}
              onOpenChange={onOpenChange}
            />

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname === "/goal-groups"}
                onClick={() => navigate("/goal-groups", { replace: true })}
                className="h-auto min-h-9 p-3 flex items-center gap-3 hover:bg-sky-200 [&_svg]:size-auto data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:border-l-4 data-[active=true]:border-sky-300"
              >
                <Flag className="w-12 h-12 shrink-0" />
                <span className="text-base">Goal</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname.startsWith("/setting")}
                onClick={() => navigate("/setting/category", { replace: true })}
                className="h-auto min-h-9 p-3 flex items-center gap-3 hover:bg-sky-200 [&_svg]:size-auto data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:border-l-4 data-[active=true]:border-sky-300"
              >
                <Settings className="w-12 h-12 shrink-0" />
                <span className="text-base">Setting</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};

export default SidebarContentSection;
