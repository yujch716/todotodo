import { Card } from "@/components/ui/card.tsx";
import { getCalendarEventByDate } from "@/api/calendar-event.ts";
import { useCallback, useEffect, useState } from "react";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import { Lightbulb } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { useCalendarStore } from "@/store/calendarStore.ts";
import DailyNoticeScheduleCard from "@/pages/daily-log/DailyNoticeScheduleCard.tsx";
import type { Challenge } from "@/types/challenge.ts";
import DailyNoticeDailyChallengeCard from "@/pages/daily-log/DailyNoticeDailyChallengeCard.tsx";
import {
  getOngoingDailyChallengesByDate,
  getOngoingGoalChallengesByDate,
} from "@/api/chanllege.ts";
import DailyNoticeGoalChallengeCard from "@/pages/daily-log/DailyNoticeGoalChallengeCard.tsx";

interface Props {
  dailyLogDate: Date;
}

export const DailyNoticePanel = ({ dailyLogDate }: Props) => {
  const [schedules, setSchedules] = useState<CalendarEventType[]>([]);
  const [dailyChallenges, setDailyChallenges] = useState<Challenge[]>([]);
  const [goalChallenges, setGoalChallenges] = useState<Challenge[]>([]);

  const refreshCalendar = useCalendarStore((state) => state.refreshCalendar);
  const resetCalendarRefresh = useCalendarStore(
    (state) => state.resetCalendarRefresh,
  );

  const loadDailySchedule = useCallback(async () => {
    const dailySchedules = await getCalendarEventByDate(dailyLogDate);
    setSchedules(dailySchedules);
  }, [dailyLogDate]);

  const loadDailyChallenges = useCallback(async () => {
    const dailyChallenges = await getOngoingDailyChallengesByDate(dailyLogDate);
    const goalChallenges = await getOngoingGoalChallengesByDate();

    setDailyChallenges(dailyChallenges);
    setGoalChallenges(goalChallenges);
  }, [dailyLogDate]);

  useEffect(() => {
    if (refreshCalendar) {
      loadDailySchedule();
      loadDailyChallenges();
      resetCalendarRefresh();
    }
  }, [
    refreshCalendar,
    loadDailySchedule,
    loadDailyChallenges,
    resetCalendarRefresh,
  ]);

  useEffect(() => {
    loadDailySchedule();
    loadDailyChallenges();
  }, [loadDailySchedule, loadDailyChallenges]);

  return (
    <>
      <Card className="flex flex-row w-full p-3 mb-4 bg-transparent items-center">
        <Lightbulb />
        <ScrollArea className="w-full overflow-x-auto p-2">
          <div className="flex flex-row gap-3">
            {schedules.map((schedule) => (
              <DailyNoticeScheduleCard schedule={schedule} />
            ))}

            {dailyChallenges.map((challenge) => (
              <DailyNoticeDailyChallengeCard
                challenge={challenge}
                date={dailyLogDate}
              />
            ))}

            {goalChallenges.map((challenge) => (
              <DailyNoticeGoalChallengeCard challenge={challenge} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>
    </>
  );
};
export default DailyNoticePanel;
