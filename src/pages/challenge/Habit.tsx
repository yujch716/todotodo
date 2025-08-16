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
import ChallengeCompleteModal from "@/pages/challenge/ChallengeCompleteModal.tsx";
import { useState } from "react";
import ChallengeLogCard from "@/pages/challenge/ChallengeLogCard.tsx";

interface HabitProps {
  challenge: Challenge;
}

interface HeatmapDay {
  date: Date | null;
  completed: boolean;
}

const Habit = ({ challenge }: HabitProps) => {
  const WEEKDAYS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];
  const logs: ChallengeLog[] = challenge.challenge_log || [];

  const [openModal, setOpenModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleOpenModal = (date: Date) => {
    setSelectedDate(date);
    setOpenModal(true);
  };

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
    const logDates = logs.map((l) => startOfDay(new Date(l.date))); // 시간 제거
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
        days.push({
          date: inRange ? new Date(currentDate) : null,
          completed: inRange
            ? logDates.some((ld) => isSameDay(ld, currentDate))
            : false,
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

  return (
    <>
      <div className="w-full h-full flex flex-col">
        <div className="py-5 flex-none">
          <Progress value={progressValue} className="w-full border-2" />
        </div>

        <Card className="w-full p-4 mb-8 flex-none">
          <div className="flex">
            <div className="flex flex-col justify-between pr-2 gap-2">
              {displayWeekdays.map((d, i) => (
                <div
                  key={i}
                  className="text-xs text-gray-500 font-bold h-4 flex items-center"
                >
                  {d}
                </div>
              ))}
            </div>

            <ScrollArea className="flex">
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
                              onClick={() => handleOpenModal(day.date!)}
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

        <ChallengeLogCard logs={logs} />

        {selectedDate && (
          <ChallengeCompleteModal
            open={openModal}
            onOpenChange={setOpenModal}
            challengeId={challenge.id}
            date={selectedDate}
          />
        )}
      </div>
    </>
  );
};
export default Habit;
