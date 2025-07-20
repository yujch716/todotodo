import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar.tsx";
import { Calendar } from "lucide-react";
import CreateChecklistModal from "@/pages/checklist/CreateChecklistModal.tsx";
import ChecklistCollapsible from "@/pages/home/sidebar/ChecklistCollapsible.tsx";
import { useNavigate } from "react-router-dom";
import type { ChecklistType } from "@/types/daily-log.ts";

interface ChecklistState {
  checklists: ChecklistType[];
  selectedId: string | null;
  isOpen: boolean;
}

interface Props {
  checklistState: ChecklistState;
  onSelect: (id: string) => void;
  onOpenChange: (open: boolean) => void;
}

const SidebarContentSection = ({
  checklistState,
  onSelect,
  onOpenChange,
}: Props) => {
  const { checklists, selectedId, isOpen } = checklistState;
  const navigate = useNavigate();

  return (
    <>
      <SidebarGroup>
        <SidebarGroupContent>
          <SidebarMenu>
            <CreateChecklistModal />
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

            <ChecklistCollapsible
              checklists={checklists}
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
