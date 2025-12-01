import { Progress } from "@/components/ui/progress.tsx";
import { Card } from "@/components/ui/card.tsx";
import {
  addDays,
  format,
  formatDate,
  isSameDay,
  startOfDay,
  startOfWeek,
} from "date-fns";
import { cn } from "@/lib/utils.ts";
import type { Goal, GoalLog } from "@/types/goal.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import CompleteGoalModal from "@/pages/goal/CompleteGoalModal.tsx";
import { useState } from "react";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";
import { deleteGoalLogById } from "@/api/goal-log.ts";
import { useGoalStore } from "@/store/goalStore.ts";
import { CalendarIcon, PartyPopper } from "lucide-react";
import { Label } from "@/components/ui/label.tsx";
import { updateGoalCompleted } from "@/api/goal.ts";

interface GoalProps {
  goal: Goal;
}

interface HeatmapDay {
  date: Date | null;
  logId: string | null;
  completed: boolean;
}

const DailyGoalCard = ({ goal }: GoalProps) => {
  const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const logs: GoalLog[] = goal.goal_log || [];
  const isComplete = goal.is_completed;

  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [isLogDeleteAlertOpen, setIsLogDeleteAlertOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedLogId, setSelectedLogId] = useState<string | null>(null);

  const triggerGoalRefresh = useGoalStore((state) => state.triggerGoalRefresh);

  const generateHeatmapData = ({
    startDate,
    endDate,
    logs,
    repeatDays,
  }: {
    startDate: Date;
    endDate: Date;
    logs: GoalLog[];
    repeatDays: string[];
  }) => {
    const repeatDaysInt = repeatDays.map((d) => WEEKDAYS.indexOf(d));

    let firstValidDate = startOfDay(
      startOfWeek(startDate, { weekStartsOn: 0 }),
    );
    const offsetStart = (repeatDaysInt[0] - firstValidDate.getDay() + 7) % 7;
    firstValidDate = addDays(firstValidDate, offsetStart);

    let lastValidDate = startOfDay(new Date(endDate));
    const offsetEnd =
      (repeatDaysInt[repeatDaysInt.length - 1] - lastValidDate.getDay() + 7) %
      7;
    lastValidDate = addDays(lastValidDate, offsetEnd);

    const days: HeatmapDay[] = [];
    let currentDate = new Date(firstValidDate);

    while (currentDate <= lastValidDate) {
      if (repeatDaysInt.includes(currentDate.getDay())) {
        const inRange =
          currentDate >= startOfDay(startDate) &&
          currentDate <= startOfDay(endDate);
        const matchedLog = logs.find((l) =>
          isSameDay(startOfDay(new Date(l.date)), currentDate),
        );

        days.push({
          date: inRange ? new Date(currentDate) : null,
          logId: matchedLog ? matchedLog.id : null,
          completed: !!matchedLog,
        });
      }
      currentDate = addDays(currentDate, 1);
    }

    const weeks: HeatmapDay[][] = [];
    for (let i = 0; i < days.length; i += repeatDaysInt.length) {
      weeks.push(days.slice(i, i + repeatDaysInt.length));
    }

    return weeks;
  };

  const data = generateHeatmapData({
    startDate: new Date(goal.start_date),
    endDate: new Date(goal.end_date),
    logs,
    repeatDays: goal.repeat_days || [],
  });

  const displayWeekdays =
    goal.repeat_days && goal.repeat_days.length
      ? goal.repeat_days.map((d) => d.charAt(0).toUpperCase() + d.slice(1))
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const totalDays = data.flat().filter((day) => day.date !== null).length;
  const completedDays = logs.length;
  const progressValue = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

  const handleOpenCompleteModal = (date: Date) => {
    setSelectedDate(date);
    setOpenCompleteModal(true);
  };

  const handleLogDelete = async () => {
    if (!selectedLogId) return;

    setIsLogDeleteAlertOpen(true);
  };

  const handleConfirmLogDelete = async () => {
    if (!selectedLogId) return;
    setIsLogDeleteAlertOpen(false);

    await deleteGoalLogById(selectedLogId);

    await updateGoalCompleted(goal.id, { is_completed: false });

    setSelectedLogId(null);

    triggerGoalRefresh();
  };

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="flex w-full items-center justify-between">
          <div className="text-lg text-muted-foreground flex flex-row gap-2 items-center">
            <CalendarIcon className="w-5 h-5" />
            {formatDate(goal.start_date!, "yyyy.MM.dd")} -{" "}
            {formatDate(goal.end_date!, "yyyy.MM.dd")}
          </div>
          <Label
            className={`flex flex-row transition-opacity duration-200 text-muted-foreground items-center gap-2 ${
              isComplete ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
          >
            Complete! <PartyPopper />
          </Label>
        </div>
        <div className="flex-none mt-2 mb-4">
          <Progress value={progressValue} className="w-full border-2" />
        </div>

        <Card className="w-full flex-none p-4">
          <div className="flex">
            <div className="flex flex-col justify-between pr-2 gap-2 p-4">
              {displayWeekdays.map((d, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 font-bold h-4 flex items-center"
                >
                  {d}
                </div>
              ))}
            </div>

            <ScrollArea className="flex p-4">
              <div className="flex flex-row gap-2 min-w-max">
                {data.map((week, wi) => (
                  <div
                    key={wi}
                    className="flex flex-col justify-between gap-2 flex-shrink-0"
                  >
                    {week.map((day, di) =>
                      day && day.date ? (
                        <Tooltip key={di}>
                          <TooltipTrigger asChild>
                            <div
                              className={cn(
                                "w-5 h-5 rounded-sm border cursor-pointer",
                                day.completed
                                  ? "bg-sky-200"
                                  : "hover:bg-slate-100 hover:border-slate-300",
                              )}
                              onClick={() => {
                                if (day.completed && day.logId) {
                                  setSelectedLogId(day.logId);
                                  handleLogDelete();
                                } else {
                                  handleOpenCompleteModal(day.date!);
                                }
                              }}
                            />
                          </TooltipTrigger>
                          <TooltipContent className="bg-slate-100">
                            <p>{format(day.date, "yyyy-MM-dd")}</p>
                            <TooltipArrow className="fill-slate-100 stroke-gray-200 stroke-[2]" />
                          </TooltipContent>
                        </Tooltip>
                      ) : (
                        <div key={di} className="w-5 h-5" />
                      ),
                    )}
                  </div>
                ))}
              </div>
              <ScrollBar orientation="horizontal" />
            </ScrollArea>
          </div>
        </Card>

        {selectedDate && (
          <CompleteGoalModal
            open={openCompleteModal}
            onOpenChange={setOpenCompleteModal}
            goalId={goal.id}
            date={selectedDate}
            totalDays={totalDays}
            completedDays={completedDays}
          />
        )}

        <AlertConfirmModal
          open={isLogDeleteAlertOpen}
          message="이 수행을 취소하시겠습니까?"
          onConfirm={handleConfirmLogDelete}
          onCancel={() => setIsLogDeleteAlertOpen(false)}
        />
      </div>
    </>
  );
};
export default DailyGoalCard;
