import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { ItemGroup } from "@/components/ui/item.tsx";
import type { Goal, GoalStatusType } from "@/types/goal.ts";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import GoalDetailPage from "@/pages/goal/GoalDetailPage.tsx";
import { useEffect, useState } from "react";
import DroppableArea from "./DroppableArea.tsx";
import DraggableGoalItem from "./DraggableGoalItem.tsx";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

interface Props {
  status: GoalStatusType;
  goals: Goal[];
}

const STATUS_CONFIG = {
  not_started: { title: "예정", checkedCount: 0, totalCount: 0 },
  in_progress: { title: "진행 중", checkedCount: 1, totalCount: 2 },
  completed: { title: "완료", checkedCount: 2, totalCount: 2 },
} as const;

const GoalStatusPanel = ({ status, goals }: Props) => {
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsSmall(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsSheetOpen(true);
  };

  const statusInfo = STATUS_CONFIG[status];

  return (
    <>
      <div className="flex flex-col w-full h-full rounded-xl border shadow-xl bg-slate-100 border-slate-50">
        <div className="flex flex-row border-b-2 p-4 border-slate-50">
          <div className="flex flex-row items-center gap-2">
            <DailyLogStatusIcon
              checkedCount={statusInfo.checkedCount}
              totalCount={statusInfo.totalCount}
              iconClassName="w-6 h-6"
            />
            <h2 className="text-sm font-semibold">{statusInfo.title}</h2>
          </div>
        </div>
        <DroppableArea status={status}>
          <div className="flex flex-col p-4 gap-4 overflow-y-auto">
            <ItemGroup className="gap-4">
              <SortableContext
                items={goals.map((g) => g.id)}
                strategy={verticalListSortingStrategy}
              >
                {goals.map((goal) => (
                  <DraggableGoalItem
                    key={goal.id}
                    goal={goal}
                    onSelect={() => handleGoalSelect(goal.id)}
                  />
                ))}
              </SortableContext>
            </ItemGroup>
          </div>
        </DroppableArea>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger className="hidden" />
        <SheetContent
          style={{
            width: isSmall ? "100vw" : "50vw",
            maxWidth: "none",
          }}
        >
          <SheetTitle />
          <GoalDetailPage goalId={selectedGoalId} />
        </SheetContent>
      </Sheet>
    </>
  );
};

export default GoalStatusPanel;
