import { Progress } from "@/components/ui/progress.tsx";
import { Card } from "@/components/ui/card.tsx";
import { addDays, format, isSameDay, startOfDay, startOfWeek } from "date-fns";
import { cn } from "@/lib/utils.ts";
import type { Challenge, ChallengeLog } from "@/types/challenge.ts";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip.tsx";
import { TooltipArrow } from "@radix-ui/react-tooltip";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import CompleteChallengeModal from "@/pages/challenge/CompleteChallengeModal.tsx";
import { useState } from "react";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";
import { deleteChallengeLogById } from "@/api/challenge-log.ts";
import { useChallengeStore } from "@/store/challengeStore.ts";

interface ChallengeProps {
  challenge: Challenge;
}

interface HeatmapDay {
  date: Date | null;
  logId: string | null;
  completed: boolean;
}

const DailyChallengeCard = ({ challenge }: ChallengeProps) => {
  const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const logs: ChallengeLog[] = challenge.challenge_log || [];

  const [openCompleteModal, setOpenCompleteModal] = useState(false);
  const [isLogDeleteAlertOpen, setIsLogDeleteAlertOpen] = useState(false);

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [seletedLogId, setSeletedLogId] = useState<string | null>(null);

  const triggerChallengeRefresh = useChallengeStore(
    (state) => state.triggerChallengeRefresh,
  );

  const generateHeatmapData = ({
    startDate,
    endDate,
    logs,
    repeatDays,
  }: {
    startDate: Date;
    endDate: Date;
    logs: ChallengeLog[];
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
    startDate: new Date(challenge.start_date),
    endDate: new Date(challenge.end_date),
    logs,
    repeatDays: challenge.repeat_days || [],
  });

  const displayWeekdays =
    challenge.repeat_days && challenge.repeat_days.length
      ? challenge.repeat_days.map((d) => d.charAt(0).toUpperCase() + d.slice(1))
      : ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const totalDays = data.flat().filter((day) => day.date !== null).length;
  const completedDays = logs.length;
  const progressValue = totalDays > 0 ? (completedDays / totalDays) * 100 : 0;

  const handleOpenCompleteModal = (date: Date) => {
    setSelectedDate(date);
    setOpenCompleteModal(true);
  };

  const handleLogDelete = async () => {
    if (!seletedLogId) return;

    setIsLogDeleteAlertOpen(true);
  };

  const handleConfirmLogDelete = async () => {
    if (!seletedLogId) return;
    setIsLogDeleteAlertOpen(false);

    await deleteChallengeLogById(seletedLogId);
    setSeletedLogId(null);

    triggerChallengeRefresh();
  };

  return (
    <>
      <div className="w-full flex flex-col">
        <div className="pb-5 flex-none">
          <Progress value={progressValue} className="w-full border-2" />
        </div>

        <Card className="w-full flex-none">
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
                                  setSeletedLogId(day.logId);
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
          <CompleteChallengeModal
            open={openCompleteModal}
            onOpenChange={setOpenCompleteModal}
            challengeId={challenge.id}
            date={selectedDate}
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
export default DailyChallengeCard;
