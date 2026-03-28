import { Card } from "@/components/ui/card.tsx";
import { getCalendarEventByDate } from "@/api/calendar-event.ts";
import { useCallback, useEffect, useState } from "react";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import DailyNoticeScheduleCard from "@/pages/daily-log/notice/DailyNoticeScheduleCard.tsx";
import type { Goal } from "@/types/goal.ts";
import DailyNoticeRoutineGoalCard from "@/pages/daily-log/notice/DailyNoticeRoutineGoalCard.tsx";
import {
   getOngoingProgressGoalsByDate, getOngoingRoutineGoalsByDate,
} from "@/api/goal.ts";
import DailyNoticeProgressGoalCard from "@/pages/daily-log/notice/DailyNoticeProgressGoalCard.tsx";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet.tsx";
import GoalDetailPage from "@/pages/goal/GoalDetailPage.tsx";
import { useDailyNoticeStore } from "@/store/dailyNoticeStore.ts";

interface Props {
  dailyLogDate: Date;
}

export const DailyNoticePanel = ({ dailyLogDate }: Props) => {
  const [schedules, setSchedules] = useState<CalendarEventType[]>([]);
  const [dailyGoals, setDailyGoals] = useState<Goal[]>([]);
  const [milestoneGoals, setMilestoneGoals] = useState<Goal[]>([]);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [selectedGoalId, setSelectedGoalId] = useState<string | null>(null);
  const [isSmall, setIsSmall] = useState(false);

  const refreshDailyNotice = useDailyNoticeStore(
    (state) => state.refreshDailyNotice,
  );
  const resetDailyNoticeRefresh = useDailyNoticeStore(
    (state) => state.resetDailyNoticeRefresh,
  );

  const loadDailySchedule = useCallback(async () => {
    const dailySchedules = await getCalendarEventByDate(dailyLogDate);
    setSchedules(dailySchedules);
  }, [dailyLogDate]);

  const loadDailyGoals = useCallback(async () => {
    const dailyGoals = await getOngoingRoutineGoalsByDate(dailyLogDate);
    const milestoneGoals = await getOngoingProgressGoalsByDate();

    setDailyGoals(dailyGoals);
    setMilestoneGoals(milestoneGoals);
  }, [dailyLogDate]);

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoalId(goalId);
    setIsSheetOpen(true);
  };

  useEffect(() => {
    if (refreshDailyNotice) {
      loadDailySchedule();
      loadDailyGoals();
      resetDailyNoticeRefresh();
    }
  }, [
    refreshDailyNotice,
    loadDailySchedule,
    loadDailyGoals,
    resetDailyNoticeRefresh,
  ]);

  useEffect(() => {
    loadDailySchedule();
    loadDailyGoals();
  }, [loadDailySchedule, loadDailyGoals]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 767px)");
    const handleChange = () => setIsSmall(mediaQuery.matches);

    handleChange();
    mediaQuery.addEventListener("change", handleChange);

    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <Card className="flex flex-col w-full p-3 bg-transparent items-center min-w-0">
        <div className="w-full overflow-y-auto overflow-x-hidden">
          <div className="flex flex-col gap-3">
            {schedules.map((schedule) => (
              <DailyNoticeScheduleCard key={schedule.id} schedule={schedule} />
            ))}

            {dailyGoals.map((goal) => (
              <DailyNoticeRoutineGoalCard
                key={goal.id}
                goal={goal}
                date={dailyLogDate}
                onClick={() => handleGoalSelect(goal.id)}
              />
            ))}

            {milestoneGoals.map((goal) => (
              <DailyNoticeProgressGoalCard
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
        <SheetContent
          style={{
            width: isSmall ? "100vw" : "50vw",
            maxWidth: "none",
          }}
        >
          <GoalDetailPage goalId={selectedGoalId} />
        </SheetContent>
      </Sheet>
    </>
  );
};
export default DailyNoticePanel;
