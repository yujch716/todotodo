import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item.tsx";
import { ChevronRightIcon } from "lucide-react";
import type { Goal, GoalStatusType } from "@/types/goal.ts";
import { format } from "date-fns";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet.tsx";
import GoalDetail from "@/pages/goal/GoalDetail.tsx";
import { useEffect, useState } from "react";

interface Props {
  status: GoalStatusType;
  goals: Goal[];
}

const GoalStatusPanel = ({ status, goals }: Props) => {
  const statusMap = {
    not_started: { title: "예정", checkedCount: 0, totalCount: 0 },
    in_progress: { title: "진행 중", checkedCount: 1, totalCount: 2 },
    completed: { title: "완료", checkedCount: 2, totalCount: 2 },
  } as const;

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

  useEffect(() => {
    const mediaQuerySmall = window.matchMedia("(max-width: 767px)");
    const handleChange = () => {
      setIsSmall(mediaQuerySmall.matches);
    };
    handleChange();

    mediaQuerySmall.addEventListener("change", handleChange);

    return () => {
      mediaQuerySmall.removeEventListener("change", handleChange);
    };
  }, []);

  return (
    <>
      <div className="flex flex-col w-full h-full rounded-xl border shadow-xl bg-slate-100 border-slate-50">
        <div className="flex flex-row border-b-2 p-4 border-slate-50">
          <div className="flex flex-row items-center gap-2">
            <DailyLogStatusIcon
              checkedCount={statusMap[status].checkedCount}
              totalCount={statusMap[status].totalCount}
              iconClassName="w-6 h-6"
            />
            <h2 className="text-sm font-semibold">{statusMap[status].title}</h2>
          </div>
        </div>
        <div className="flex flex-col p-4 gap-4 overflow-y-auto">
          <ItemGroup className="gap-4">
            {goals.map((goal) => (
              <Item
                key={goal.id}
                variant="outline"
                asChild
                role="listitem"
                className="bg-white shadow-sm hover:bg-gradient-to-br hover:from-white hover:to-slate-200"
                onClick={() => {
                  setSelectedGoalId(goal.id);
                  setIsSheetOpen(true);
                }}
              >
                <a href="#">
                  <ItemMedia variant="image" className="text-xl">
                    {goal.emoji}
                  </ItemMedia>
                  <ItemContent>
                    <ItemTitle className="line-clamp-1">{goal.title}</ItemTitle>
                    <ItemDescription>
                      {format(goal.created_at, "yyyy.MM.dd")}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <ChevronRightIcon className="size-4" />
                  </ItemActions>
                </a>
              </Item>
            ))}
          </ItemGroup>
        </div>
      </div>

      <Sheet open={isSheetOpen} onOpenChange={(open) => setIsSheetOpen(open)}>
        <SheetTrigger className="hidden" />
        <SheetContent
          style={{
            width: isSmall ? "100vw" : "50vw",
            maxWidth: "none",
          }}
        >
          <SheetTitle />
          <GoalDetail goalId={selectedGoalId} />
        </SheetContent>
      </Sheet>
    </>
  );
};
export default GoalStatusPanel;
