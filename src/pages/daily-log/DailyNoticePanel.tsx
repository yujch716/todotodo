import { Card } from "@/components/ui/card.tsx";
import { getCalendarEventByDate } from "@/api/calendar-event.ts";
import { useCallback, useEffect, useState } from "react";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import { Lightbulb } from "lucide-react";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { useCalendarStore } from "@/store/calendarStore.ts";
import DailyNoticeEventCard from "@/pages/daily-log/DailyNoticeEventCard.tsx";

interface Props {
  dailyLogDate: Date;
}

export const DailyNoticePanel = ({ dailyLogDate }: Props) => {
  const [schedules, setSchedules] = useState<CalendarEventType[]>([]);

  const refreshCalendar = useCalendarStore((state) => state.refreshCalendar);
  const resetCalendarRefresh = useCalendarStore(
    (state) => state.resetCalendarRefresh,
  );

  const loadDailySchedule = useCallback(async () => {
    const dailySchedules = await getCalendarEventByDate(dailyLogDate);
    setSchedules(dailySchedules);
  }, [dailyLogDate]);

  useEffect(() => {
    if (refreshCalendar) {
      loadDailySchedule();
      resetCalendarRefresh();
    }
  }, [refreshCalendar, loadDailySchedule, resetCalendarRefresh]);

  useEffect(() => {
    loadDailySchedule();
  }, [loadDailySchedule]);

  return (
    <>
      <Card className="flex flex-row w-full p-3 mb-4 bg-transparent items-center">
        <Lightbulb />
        <ScrollArea className="w-full overflow-x-auto p-2">
          <div className="flex flex-row gap-3">
            {schedules.map(
              (schedule) => (
                <DailyNoticeEventCard schedule={schedule} />
              ),
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>
    </>
  );
};
export default DailyNoticePanel;
