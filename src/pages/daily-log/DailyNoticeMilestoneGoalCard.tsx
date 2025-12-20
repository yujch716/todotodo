import { GoalStatus } from "@/types/goal.ts";
import type { Goal, GoalLog } from "@/types/goal.ts";
import { Card } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Flag } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
// import { useNavigate } from "react-router-dom";

interface DailyNoticeGoalGoalProps {
  goal: Goal;
}

const DailyNoticeMilestoneGoalCard = ({ goal }: DailyNoticeGoalGoalProps) => {
  // const navigate = useNavigate();

  const { id, emoji, title, goal_log, target_value } = goal;
  const logs: GoalLog[] = goal_log || [];
  const targetValue = target_value!;
  const completeValue = logs.reduce((acc, log) => acc + log.value, 0);
  const progressValue = Math.floor((completeValue / targetValue) * 100);
  const isCompleted = goal.status === GoalStatus.completed;

  // const handelMoveGoal = () => {
  //   navigate(`/goal?id=${id}`);
  // };

  return (
      <Card
        key={id}
        className="p-3 w-full cursor-pointer min-w-0 shadow-sm hover:shadow-md hover:bg-gradient-to-br hover:from-white hover:to-slate-100"
        // onClick={() => {
        //   handelMoveGoal();
        // }}
      >
        <div className="flex flex-row items-center gap-2 pb-2">
          <span className="flex-shrink-0">{emoji}</span>
          <h1
            className="text-base font-bold leading-tight truncate min-w-0 flex-1"
            style={{ minWidth: 0 }}
          >
            {title}
          </h1>
        </div>

        <div className="flex items-center gap-2 min-w-0 w-full">
          <Progress value={progressValue} className="border-2 flex-1 min-w-0" />
          <Label className="inline-flex items-center gap-1">
            <Flag
              className={`w-4 h-4 ${isCompleted ? "text-sky-300" : "text-transparent"}`}
              stroke="black"
              fill={isCompleted ? "currentColor" : "none"}
            />
            {targetValue}
          </Label>
        </div>
      </Card>
  );
};
export default DailyNoticeMilestoneGoalCard;
