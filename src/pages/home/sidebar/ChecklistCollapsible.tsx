// ChecklistCollapsible.tsx
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
}: Props) => (
  <Collapsible
    open={isOpen}
    onOpenChange={onOpenChange}
    className="group/collapsible"
  >
    <SidebarMenuItem>
      <CollapsibleTrigger asChild>
        <SidebarMenuButton className="flex items-center justify-between w-full">
          <div className="flex items-center">
            <List className="mr-2" />
            Checklist
          </div>
          {isOpen ? (
            <ChevronDown className="w-4 h-4" />
          ) : (
            <ChevronRight className="w-4 h-4" />
          )}
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
              onClick={() => onSelect(item.id)}
            >
              {item.title}
            </SidebarMenuSubItem>
          ))}
        </SidebarMenuSub>
      </CollapsibleContent>
    </SidebarMenuItem>
  </Collapsible>
);

export default ChecklistCollapsible;
