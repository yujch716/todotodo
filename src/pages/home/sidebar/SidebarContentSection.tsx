import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Calendar, BookText, Flag, Settings } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import type { DailyLogType } from "@/types/daily-log.ts";

interface Props {
  dailyLog: DailyLogType | null;
}

const SidebarContentSection = ({ dailyLog }: Props) => {
  const dailyPath = dailyLog ? `${dailyLog.id}` : "undefined";
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

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname.startsWith("/daily")}
                onClick={() =>
                  navigate(`/daily/${dailyPath}`, { replace: true })
                }
                className="h-auto min-h-9 p-3 flex items-center gap-3 hover:bg-sky-200 [&_svg]:size-auto data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:border-l-4 data-[active=true]:border-sky-300"
              >
                <BookText className="w-12 h-12 shrink-0" />
                <span className="text-base">Daily</span>
              </SidebarMenuButton>
            </SidebarMenuItem>

            <SidebarMenuItem>
              <SidebarMenuButton
                isActive={location.pathname.startsWith("/goal-groups")}
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
