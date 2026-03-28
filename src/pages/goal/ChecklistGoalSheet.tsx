import {type Goal, type GoalChecklistItem, GoalStatus} from "@/types/goal.ts";
import {Card} from "@/components/ui/card.tsx";
import {Progress} from "@/components/ui/progress.tsx";
import {ChevronDown, Flag, PartyPopper} from "lucide-react";
import {Label} from "@/components/ui/label.tsx";
import {ScrollArea} from "@/components/ui/scroll-area.tsx";

interface GoalProps {
  goal: Goal;
}

const ChecklistGoalSheet = ({ goal }: GoalProps) => {
  const goalChecklistItem: GoalChecklistItem[] = goal.goal_checklist_item || [];
  const targetValue = goalChecklistItem.length;
  const completedValue = goalChecklistItem.filter(
    (item) => item.is_checked
  ).length;
  const progressValue = Math.floor((completedValue / targetValue) * 100);
  const isComplete = goal.status === GoalStatus.completed;

  return (
    <>
      <div className="w-full flex flex-col gap-6">
        <Card className="w-full flex-none p-6">
          <div className="flex items-center gap-3 relative pt-8 pb-2">
            <div className="relative w-full">
              <Progress value={progressValue} className="w-full border-2" />
              <div
                className="absolute -top-9 transform -translate-x-1/2 bg-white border border-gray-300 text-xs px-2 py-1 rounded-full shadow-md"
                style={{ left: `${(completedValue / targetValue) * 100}%` }}
              >
                {completedValue}

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

          <div className="flex items-center gap-4">
            <Label
              className={`flex justify-end w-full p-1 transition-opacity duration-200 text-muted-foreground items-center gap-2 ${
                isComplete ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
            >
              Complete! <PartyPopper />
            </Label>
          </div>
        </Card>

        <Card className="flex flex-col h-full p-4 overflow-hidden">
          <ScrollArea className="h-full">

          </ScrollArea>
        </Card>
      </div>
    </>
  )
}
export default ChecklistGoalSheet