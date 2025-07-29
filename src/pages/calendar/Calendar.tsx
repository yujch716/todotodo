import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import type { DailyLogType } from "@/types/daily-log.ts";
import type { CalendarEventType } from "@/types/calendar-event.ts";
import { useCalendarStore } from "@/store/calendarStore.ts";
import { getDailyLogsByDate } from "@/api/daily-log.ts";
import { getCalendarEvents } from "@/api/calendar-event.ts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { addMonths, format, isSameDay, isSameMonth, subMonths } from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils.ts";
import CreateEventModal from "@/pages/calendar/CreateEventModal.tsx";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { Button } from "@/components/ui/button.tsx";
import EventDetailModal from "@/pages/calendar/EventDetailModal.tsx";

const Calendar = () => {
  const navigate = useNavigate();

  const [dailyLogs, setDailyLogs] = useState<DailyLogType[]>([]);
  const [events, setEvents] = useState<CalendarEventType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(
    null,
  );
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);

  const refreshCalendar = useCalendarStore((state) => state.refreshCalendar);
  const resetCalendarRefresh = useCalendarStore(
    (state) => state.resetCalendarRefresh,
  );

  const loadDailyLogs = useCallback(async () => {
    const start = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      1,
    );
    const end = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0,
    );

    const dailyLogs = await getDailyLogsByDate(start, end);
    const calendarEvents = await getCalendarEvents(start, end);

    setEvents(calendarEvents);
    setDailyLogs(dailyLogs);
  }, [currentMonth]);

  const onDayClick = (date: Date) => {
    setSelectedDateForModal(date);
    setModalOpen(true);
  };

  useEffect(() => {
    loadDailyLogs();
  }, [loadDailyLogs]);

  useEffect(() => {
    if (refreshCalendar) {
      loadDailyLogs();
      resetCalendarRefresh();
    }
  }, [refreshCalendar, loadDailyLogs, resetCalendarRefresh]);

  const getDailyLogForDate = (date: Date) => {
    return dailyLogs.find(
      (item) => new Date(item.date).toDateString() === date.toDateString(),
    );
  };

  const getEventForDate = (date: Date) => {
    return events.filter((item) => {
      const start = new Date(item.start_at);
      const end = new Date(item.end_at);
      return date >= start && date <= end;
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <button
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-100 rounded"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
          <button
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
            className="p-2 hover:bg-slate-100 rounded"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </CardHeader>

        <CardContent>
          <DayPicker
            mode="single"
            month={currentMonth}
            onMonthChange={(month) => setCurrentMonth(month)}
            showOutsideDays
            className="p-0"
            classNames={{
              caption: "hidden",
              months: "flex flex-col sm:flex-row gap-4",
              month: "space-y-4",
              table:
                "w-full border-4 border-slate-200 border-collapse table-fixed rounded-xl",
              head_row: "",
              head_cell:
                "font-medium text-center text-sm bg-slate-200 py-2 font-bold",
              row: "",
              cell: "h-[100px] md:h-[120px] lg:h-[140px] text-sm p-0 relative border-2 border-slate-200",
              day: "h-full w-full p-1 font-normal flex flex-col items-center justify-start text-sm",
              day_selected: "bg-primary text-white hover:bg-primary/90",
              day_outside: "text-gray-400",
            }}
            formatters={{
              formatWeekdayName: (date) => format(date, "EEE"),
            }}
            components={{
              Day: (dayProps: any) => {
                const { date, className, onClick, onKeyDown, onFocus, onBlur } =
                  dayProps;
                const dailyLog = getDailyLogForDate(date);
                const events = getEventForDate(date);
                const isToday = isSameDay(date, new Date());
                const isOutside = !isSameMonth(date, currentMonth);

                return (
                  <div
                    className={cn(
                      className,
                      "flex flex-col h-full p-2 group",
                      isToday && "bg-slate-100",
                      isOutside && "text-gray-400",
                    )}
                    onClick={onClick}
                    onKeyDown={onKeyDown}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    tabIndex={0}
                  >
                    <div className="flex pb-2 justify-between items-center">
                      <span
                        className={cn(
                          "text-xs",
                          isToday &&
                            "rounded-full border-2 border-sky-200 px-1 bg-sky-200",
                        )}
                      >
                        {date.getDate()}
                      </span>
                      <Button
                        variant="outline"
                        size="icon"
                        className="invisible group-hover:visible w-6 h-6 flex items-center justify-center"
                        onClick={() => onDayClick(date)}
                      >
                        <CalendarPlus />
                      </Button>
                    </div>
                    <div>
                      {events.length > 0 && (
                        <ul className="text-[11px] leading-tight">
                          {events.map((item, i) => {
                            return (
                              <Card
                                key={i}
                                className="p-1 mb-1 hover:bg-slate-50 min-h-[30px] flex items-center"
                                style={{
                                  backgroundColor:
                                    item.category?.color || undefined,
                                }}
                                onClick={() => {
                                  setSelectedEventId(item.id);
                                  setModalOpen(true);
                                }}
                              >
                                {item.title}
                              </Card>
                            );
                          })}
                        </ul>
                      )}
                      {dailyLog && (
                        <Card
                          className="p-1 mb-1 hover:bg-slate-50 min-h-[30px] flex items-center"
                          onClick={() => navigate(`/daily?id=${dailyLog.id}`)}
                        >
                          <div className="flex items-center space-x-2 whitespace-nowrap">
                            <DailyLogStatusIcon
                              checkedCount={dailyLog.checkedCount}
                              totalCount={dailyLog.totalCount}
                            />
                            <span>Daily</span>
                          </div>
                        </Card>
                      )}
                    </div>
                  </div>
                );
              },
            }}
          />

          {selectedDateForModal && (
            <CreateEventModal
              selectedDate={selectedDateForModal}
              open={modalOpen}
              onOpenChange={setModalOpen}
            />
          )}

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
        </CardContent>
      </Card>
    </div>
  );
};
export default Calendar;
