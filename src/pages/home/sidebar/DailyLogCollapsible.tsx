import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar.tsx";
import { BookText, ChevronDown, ChevronRight } from "lucide-react";
import type { DailyLogType } from "@/types/daily-log.ts";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { format } from "date-fns";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import { useLocation } from "react-router-dom";

interface Props {
  dailyLogs: DailyLogType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const DailyLogCollapsible = ({
  dailyLogs,
  selectedId,
  onSelect,
  isOpen,
  onOpenChange,
}: Props) => {
  const handleSelectDailyLog = (id: string) => {
    onSelect(id);
  };

  const location = useLocation();

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="group/collapsible"
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton
            isActive={location.pathname === "/daily"}
            className="h-auto min-h-9 p-3 flex items-center gap-3 hover:bg-sky-200 [&_svg]:size-auto data-[active=true]:bg-white data-[active=true]:shadow-md data-[active=true]:border-l-4 data-[active=true]:border-sky-300"
          >
            <BookText className="w-12 h-12 shrink-0" />
            <span className="text-base">Daily</span>
            <span className="ml-auto">
              {isOpen ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )}
            </span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <ScrollArea className="max-h-64 overflow-y-auto">
          <SidebarMenuSub className="border-l-2 border-sky-200">
            {dailyLogs.map((item) => (
              <SidebarMenuSubItem
                key={item.id}
                className={`truncate flex flex-col justify-start p-1 rounded-md text-sm transition-colors ${
                  item.id === selectedId ? "bg-sky-200" : "hover:bg-sky-200"
                }`}
                onClick={() => handleSelectDailyLog(item.id)}
              >
                <div className="flex items-center gap-1">
                  <DailyLogStatusIcon
                    checkedCount={item.checkedCount}
                    totalCount={item.totalCount}
                  />
                  <span>{format(new Date(item.date), "yyyy년 MM월 dd일")}</span>
                </div>
              </SidebarMenuSubItem>
            ))}
          </SidebarMenuSub>
        </ScrollArea>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default DailyLogCollapsible;
