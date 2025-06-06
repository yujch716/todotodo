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
import { ChevronDown, ChevronRight, List } from "lucide-react";
import type { ChecklistType } from "@/types/checklist.ts";
import { ChecklistStatusIcon } from "@/components/ChecklistStatusIcon.tsx";

interface Props {
  checklists: ChecklistType[];
  selectedId: string | null;
  onSelect: (id: string) => void;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ChecklistCollapsible = ({
  checklists,
  selectedId,
  onSelect,
  isOpen,
  onOpenChange,
}: Props) => {
  const handleSelectChecklist = (id: string) => {
    onSelect(id);
  };

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={onOpenChange}
      className="group/collapsible"
    >
      <CollapsibleTrigger asChild>
        <SidebarMenuItem>
          <SidebarMenuButton className="flex items-center gap-2 hover:bg-sky-200">
            <List className="w-4 h-4" />
            <span>Checklist</span>
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
        <SidebarMenuSub className="border-l-2 border-sky-200">
          {checklists.map((item) => (
            <SidebarMenuSubItem
              key={item.id}
              className={`truncate flex flex-col justify-start py-1 px-1 rounded-md text-sm transition-colors ${
                item.id === selectedId ? "bg-sky-200" : "hover:bg-sky-200"
              }`}
              onClick={() => handleSelectChecklist(item.id)}
            >
              <div className="flex items-center gap-1">
                <ChecklistStatusIcon
                  checkedCount={item.checkedCount}
                  totalCount={item.totalCount}
                />
                <span>{item.title}</span>
              </div>
              <span className="text-xs text-gray-500 ml-5">
                {String(item.date)}
              </span>
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default ChecklistCollapsible;
