import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { ChevronRightIcon } from "lucide-react";
import type { Goal } from "@/types/goal.ts";
import { format } from "date-fns";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface DraggableGoalItemProps {
  goal: Goal;
  onSelect: () => void;
}

const DraggableGoalItem = ({ goal, onSelect }: DraggableGoalItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: goal.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <Item
        variant="outline"
        role="listitem"
        className="bg-white shadow-sm hover:bg-gradient-to-br hover:from-white hover:to-slate-200 cursor-grab active:cursor-grabbing"
        onClick={() => {
          if (!isDragging) {
            onSelect();
          }
        }}
      >
        <div {...listeners} className="flex items-center gap-4 flex-grow">
          <ItemMedia variant="image" className="text-xl">
            {goal.emoji}
          </ItemMedia>
          <ItemContent>
            <ItemTitle className="line-clamp-1">{goal.title}</ItemTitle>
            <ItemDescription>
              {format(goal.created_at, "yyyy.MM.dd")}
            </ItemDescription>
          </ItemContent>
        </div>
        <ItemActions>
          <ChevronRightIcon className="size-4" />
        </ItemActions>
      </Item>
    </div>
  );
};

export default DraggableGoalItem;