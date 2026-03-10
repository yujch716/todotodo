import { Card } from "@/components/ui/card.tsx";
import { getCalendarEventByDate } from "@/api/calendar-event.ts";
import { useCallback, useEffect, useState } from "react";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import { useCalendarStore } from "@/store/calendarStore.ts";
import DailyNoticeScheduleCard from "@/pages/daily-log/DailyNoticeScheduleCard.tsx";
import type { Goal } from "@/types/goal.ts";
import DailyNoticeDailyGoalCard from "@/pages/daily-log/DailyNoticeDailyGoalCard.tsx";
import {
  getOngoingDailyGoalsByDate,
  getOngoingMilestoneGoalsByDate,
} from "@/api/goal.ts";
import DailyNoticeMilestoneGoalCard from "@/pages/daily-log/DailyNoticeMilestoneGoalCard.tsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
import GoalDetailPage from "@/pages/goal/GoalDetailPage.tsx";

interface Props {
  dailyLogDate: Date;
}

export const DailyNoticePanel = ({ dailyLogDate }: Props) => {
  const [schedules, setSchedules] = useState<CalendarEventType[]>([]);
  const [dailyGoals, setDailyGoals] = useState<Goal[]>([]);
  const [milestoneGoals, setMilestoneGoals] = useState<Goal[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);

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
    const milestoneGoals = await getOngoingMilestoneGoalsByDate();

    setDailyGoals(dailyGoals);
    setMilestoneGoals(milestoneGoals);
  }, [dailyLogDate]);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsSheetOpen(true);
  };

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
      <Card className="flex flex-col w-full p-3 bg-transparent items-center min-w-0">
        <div className="w-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-3">
            {schedules.map((schedule) => (
              <DailyNoticeScheduleCard key={schedule.id} schedule={schedule} />
            ))}

            {dailyGoals.map((goal) => (
              <DailyNoticeDailyGoalCard
                key={goal.id}
                goal={goal}
                date={dailyLogDate}
                onClick={() => handleGoalSelect(goal.id)}
              />
            ))}

            {milestoneGoals.map((goal) => (
              <DailyNoticeMilestoneGoalCard
                key={goal.id}
                goal={goal}
                onClick={() => handleGoalSelect(goal.id)}
              />
            ))}
          </div>
        </div>
      </Card>

      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger className="hidden" />
        <SheetContent className="!w-[50vw] !max-w-none">
          <GoalDetailPage goalId={selectedGoalId} />
        </SheetContent>
      </Sheet>
    </>
  );
};
export default DailyNoticePanel;
