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
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton className="flex items-center w-full gap-2">
              <List className="w-4 h-4"/>
              <span>Checklist</span>
              <span className="ml-auto">
          {isOpen ? (
              <ChevronDown className="w-4 h-4"/>
          ) : (
              <ChevronRight className="w-4 h-4"/>
          )}
        </span>
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {checklists.map((item) => (
                  <SidebarMenuSubItem
                      key={item.id}
                      className={`flex items-center w-full justify-start px-1 py-1 rounded-md text-sm transition-colors ${
                          item.id === selectedId ? "bg-slate-300" : "hover:bg-slate-200"
                      }`}
                      onClick={() => handleSelectChecklist(item.id)}
                  >
                    {item.title}
                  </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
  );
};

export default ChecklistCollapsible;
