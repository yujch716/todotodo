import type { Goal, GoalLog } from "@/types/goal.ts";
import { Card } from "@/components/ui/card.tsx";
import { CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";

interface DailyNoticeDailyGoalProps {
  goal: Goal;
  date: Date;
  onClick?: () => void;
}

const DailyNoticeRoutineGoalCard = ({
  goal,
  date,
  onClick,
}: DailyNoticeDailyGoalProps) => {
  const { id, emoji, title, start_date, end_date, goal_log } = goal;

  const isCompleted = goal_log?.some((log: GoalLog) =>
    log.date ? isSameDay(new Date(log.date), date) : false,
  );

  return (
    <Card
      key={id}
      className={`p-3 w-full cursor-pointer shadow-sm min-w-0 ${
        isCompleted
          ? "opacity-50"
          : "hover:shadow-md hover:bg-gradient-to-br hover:from-white hover:to-slate-100"
      }`}
      onClick={onClick}
    >
      <div className="flex flex-row items-center gap-2 pb-2 min-w-0">
        <span className="flex-shrink-0">{emoji}</span>
        <h1 className="text-base font-bold leading-tight truncate min-w-0 flex-1">
          {title}
        </h1>

        {isCompleted && (
          <DailyLogStatusIcon
            checkedCount={1}
            totalCount={1}
            iconClassName="w-5 h-5"
          />
        )}
      </div>

      <div className="flex items-center gap-2 min-w-0 text-sm w-full">
        <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
        <span className="truncate">
          {start_date ? format(start_date, "yy.MM.dd") : "시작일"} -{" "}
          {end_date ? format(end_date, "yy.MM.dd") : "종료일"}
        </span>
      </div>
    </Card>
  );
};
export default DailyNoticeRoutineGoalCard;
