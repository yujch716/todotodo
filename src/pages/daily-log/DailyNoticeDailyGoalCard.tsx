import type { Goal } from "@/types/goal1.ts";
import { Card } from "@/components/ui/card.tsx";
import { CalendarIcon } from "lucide-react";
import { format, isSameDay } from "date-fns";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { useNavigate } from "react-router-dom";

interface DailyNoticeDailyGoalProps {
  goal: Goal;
  date: Date;
}

const DailyNoticeDailyGoalCard = ({
  goal,
  date,
}: DailyNoticeDailyGoalProps) => {
  const navigate = useNavigate();

  const { id, emoji, title, start_date, end_date, goal_log } = goal;

  const isCompleted = goal_log?.some((log) =>
    log.date ? isSameDay(new Date(log.date), date) : false,
  );

  const handelMoveGoal = () => {
    navigate(`/goal?id=${id}`);
  };

  return (
    <div>
      <Card
        key={id}
        className={`p-3 w-[270px] cursor-pointer shadow-sm ${
          isCompleted
            ? "opacity-50"
            : "hover:shadow-md hover:bg-gradient-to-br hover:from-white hover:to-slate-100"
        }`}
        onClick={() => {
          handelMoveGoal();
        }}
      >
        <div className="flex flex-row items-center gap-2 pb-2">
          {emoji}
          <h1
            className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis leading-tight text-base font-bold"
            style={{ minWidth: 0 }}
          >
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

        <div className="flex items-center gap-2 flex-wrap text-sm">
          <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
          {start_date ? format(start_date, "yyyy-MM-dd") : "시작일"} -{" "}
          {end_date ? format(end_date, "yyyy-MM-dd") : "종료일"}
        </div>
      </Card>
    </div>
  );
};
export default DailyNoticeDailyGoalCard;
