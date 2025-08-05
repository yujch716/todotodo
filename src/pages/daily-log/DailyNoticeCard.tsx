import { Card } from "@/components/ui/card.tsx";
import { getCalendarEventByDate } from "@/api/calendar-event.ts";
import { useCallback, useEffect, useState } from "react";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import { Bell, CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import EventDetailModal from "@/pages/calendar/EventDetailModal.tsx";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area.tsx";
import { useCalendarStore } from "@/store/calendarStore.ts";

interface Props {
  dailyLogDate: Date;
}

export const DailyNoticeCard = ({ dailyLogDate }: Props) => {
  const [schedules, setSchedules] = useState<CalendarEventType[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

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

  const openModal = (eventId: string) => {
    setSelectedEventId(eventId);
    setModalOpen(true);
  };

  return (
    <>
      <Card className="w-full p-3 mb-4 bg-transparent">
        <div className="flex items-center gap-2 mb-2">
          <Bell /> <h1 className="text-xl font-bold">Notice</h1>
        </div>
        <ScrollArea className="w-full">
          <div className="flex flex-row gap-3 min-w-max pb-2">
            {schedules.map(
              ({ id, title, is_all_day, start_at, end_at, category }) => (
                <Card
                  key={id}
                  className="p-3 w-[270px] cursor-pointer shadow-sm hover:shadow-md"
                  onClick={() => openModal(id)}
                >
                  <div className="flex flex-row items-center justify-between mb-2">
                    <h1
                      className="flex-grow overflow-hidden whitespace-nowrap text-ellipsis leading-tight text-lg font-bold"
                      style={{ minWidth: 0 }}
                    >
                      {title}
                    </h1>
                    {category?.color && (
                      <div
                        className="w-5 h-5 rounded-full ml-2 flex-shrink-0"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    <CalendarIcon className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                    {is_all_day ? (
                      <>
                        {start_at ? format(start_at, "yyyy-MM-dd") : "시작일"} -{" "}
                        {end_at ? format(end_at, "yyyy-MM-dd") : "종료일"}
                      </>
                    ) : (
                      <>
                        {start_at ? format(start_at, "yyyy-MM-dd") : "시작일"}
                        <span className="mx-0.5" />
                        {format(start_at, "HH:mm")} - {format(end_at, "HH:mm")}
                      </>
                    )}
                  </div>
                </Card>
              ),
            )}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </Card>

      {selectedEventId && (
        <EventDetailModal
          eventId={selectedEventId}
          open={modalOpen}
          onOpenChange={(open) => {
            setModalOpen(open);
            if (!open) setSelectedEventId(null);
          }}
        />
      )}
    </>
  );
};
export default DailyNoticeCard;
