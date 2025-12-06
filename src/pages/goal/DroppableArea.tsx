import { useDroppable } from "@dnd-kit/core";
import type { GoalStatusType } from "@/types/goal.ts";

interface DroppableAreaProps {
  status: GoalStatusType;
  children: React.ReactNode;
}

const DroppableArea = ({ status, children }: DroppableAreaProps) => {
  const { setNodeRef, isOver } = useDroppable({
    id: status,
  });

  return (
    <div
      ref={setNodeRef}
      className={`flex flex-col w-full h-full transition-colors ${
        isOver ? "bg-blue-50" : ""
      }`}
    >
      {children}
    </div>
  );
};

export default DroppableArea;