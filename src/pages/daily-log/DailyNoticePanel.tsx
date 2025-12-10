import { Card } from "@/components/ui/card.tsx";
import { getCalendarEventByDate } from "@/api/calendar-event.ts";
import { useCallback, useEffect, useState } from "react";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { useCalendarStore } from "@/store/calendarStore.ts";
import DailyNoticeScheduleCard from "@/pages/daily-log/DailyNoticeScheduleCard.tsx";
import type { Goal } from "@/types/goal.ts";
import DailyNoticeDailyGoalCard from "@/pages/daily-log/DailyNoticeDailyGoalCard.tsx";
import {
  getOngoingDailyGoalsByDate,
  getOngoingMilestoneGoalsByDate,
} from "@/api/goal.ts";
import DailyNoticeMilestoneGoalCard from "@/pages/daily-log/DailyNoticeMilestoneGoalCard.tsx";

interface Props {
  dailyLogDate: Date;
}

export const DailyNoticePanel = ({ dailyLogDate }: Props) => {
  const [schedules, setSchedules] = useState<CalendarEventType[]>([]);
  const [dailyGoals, setDailyGoals] = useState<Goal[]>([]);
  const [goalGoals, setGoalGoals] = useState<Goal[]>([]);

  const refreshCalendar = useCalendarStore((state) => state.refreshCalendar);
  const resetCalendarRefresh = useCalendarStore(
    (state) => state.resetCalendarRefresh,
  );

  const loadDailySchedule = useCallback(async () => {
    const dailySchedules = await getCalendarEventByDate(dailyLogDate);
    setSchedules(dailySchedules);
  }, [dailyLogDate]);

  const loadDailyGoals = useCallback(async () => {
    const dailyGoals = await getOngoingDailyGoalsByDate(dailyLogDate);
    const goalGoals = await getOngoingMilestoneGoalsByDate();

    setDailyGoals(dailyGoals);
    setGoalGoals(goalGoals);
  }, [dailyLogDate]);

  useEffect(() => {
    if (refreshCalendar) {
      loadDailySchedule();
      loadDailyGoals();
      resetCalendarRefresh();
    }
  }, [
    refreshCalendar,
    loadDailySchedule,
    loadDailyGoals,
    resetCalendarRefresh,
  ]);

  useEffect(() => {
    loadDailySchedule();
    loadDailyGoals();
  }, [loadDailySchedule, loadDailyGoals]);

  return (
    <>
      <Card className="flex flex-col w-full p-3 bg-transparent items-center">
        <ScrollArea className="w-full overflow-y-auto">
          <div className="flex flex-col gap-3">
            {schedules.map((schedule) => (
              <DailyNoticeScheduleCard key={schedule.id} schedule={schedule} />
            ))}

            {dailyGoals.map((goal) => (
              <DailyNoticeDailyGoalCard
                key={goal.id}
                goal={goal}
                date={dailyLogDate}
              />
            ))}

            {goalGoals.map((goal) => (
              <DailyNoticeMilestoneGoalCard key={goal.id} goal={goal} />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>
    </>
  );
};
export default DailyNoticePanel;
