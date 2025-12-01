import type { Goal, GoalLog } from "@/types/goal.ts";
import { Card } from "@/components/ui/card.tsx";
import { Progress } from "@/components/ui/progress.tsx";
import { Label } from "@/components/ui/label.tsx";
import { ChevronDown, Flag, PartyPopper, Rocket, Save } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { useState } from "react";
import { Input } from "@/components/ui/input.tsx";
import { createGoalLog } from "@/api/goal-log.ts";
import { format } from "date-fns";
import { useGoalStore } from "@/store/goalStore.ts";
import { toast } from "sonner";
import { updateGoalCompleted } from "@/api/goal.ts";
import { showCelebration } from "@/lib/effects";

interface GoalProps {
  goal: Goal;
}

const MilestoneGoalCard = ({ goal }: GoalProps) => {
  const logs: GoalLog[] = goal.goal_log || [];
  const targetValue = goal.target_value!;
  const completeValue = logs.reduce((acc, log) => acc + log.value, 0);
  const progressValue = Math.floor((completeValue / targetValue) * 100);
  const isComplete = goal.is_completed;

  const [showInput, setShowInput] = useState(false);
  const [inputValue, setInputValue] = useState("");

  const triggerGoalRefresh = useGoalStore((state) => state.triggerGoalRefresh);

  const handleSave = async () => {
    const value = parseInt(inputValue);
    const date = format(new Date(), "yyyy-MM-dd");

    if (isNaN(value)) {
      toast.error("숫자만 입력할 수 있습니다.");
      return;
    }

    if (completeValue + value > targetValue) {
      toast.error("목표수치보다 큰 값은 입력할 수 없습니다.");
      return;
    }

    await createGoalLog({ goal_id: goal.id, date, value });
    if (completeValue + value === targetValue) {
      await updateGoalCompleted(goal.id, { is_completed: true });

      showCelebration();
    }

    triggerGoalRefresh();

    setShowInput(false);
    setInputValue("");
  };

  return (
    <>
      <div className="w-full flex flex-col">
        <Card className="w-full flex-none p-6">
          <div className="flex items-center gap-3 relative pt-8 pb-2">
            <div className="relative w-full">
              <Progress value={progressValue} className="w-full border-2" />
              <div
                className="absolute -top-9 transform -translate-x-1/2 bg-white border border-gray-300 text-xs px-2 py-1 rounded-full shadow-md"
                style={{ left: `${(completeValue / targetValue) * 100}%` }}
              >
                {completeValue}

                <ChevronDown className="w-3 h-3 absolute top-full left-1/2 -translate-x-1/2" />
              </div>
            </div>

            <Label className="inline-flex items-center gap-1">
              <Flag
                className={`w-4 h-4 ${isComplete ? "text-sky-300" : "text-transparent"}`}
                stroke="black"
                fill={isComplete ? "currentColor" : "none"}
              />
              {targetValue}
            </Label>
          </div>

          <div className="flex items-center gap-4 pt-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isComplete}
              onClick={() => setShowInput((prev) => !prev)}
            >
              <Rocket /> 완료
            </Button>

            <Card
              className={`p-1 transition-opacity duration-200 ${
                showInput ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              <div className="flex items-center gap-2">
                <Input
                  type="number"
                  className="w-20 h-9 bg-white"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={handleSave}
                  className="bg-slate-600 hover:bg-slate-500"
                >
                  <Save />
                </Button>
              </div>
            </Card>

            <Label
              className={`flex justify-end w-full p-1 transition-opacity duration-200 text-muted-foreground items-center gap-2 ${
                isComplete ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              Complete! <PartyPopper />
            </Label>
          </div>
        </Card>
      </div>
    </>
  );
};
export default MilestoneGoalCard;
