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
import {
  addDays,
  addMonths,
  endOfDay,
  format,
  isSameDay,
  isSameMonth,
  startOfDay,
  subDays,
  subMonths,
} from "date-fns";
import { CalendarPlus, ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker } from "react-day-picker";
import { cn } from "@/lib/utils.ts";
import CreateEventModal from "@/pages/calendar/CreateEventModal.tsx";
import CalendarDayCell from "@/pages/calendar/CalendarDayCell.tsx";
import { getDailyGoalByRangeDate } from "@/api/goal.ts";
import type { Goal } from "@/types/goal.ts";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile.tsx";

const Calendar = () => {
  const isMobile = useIsMobile();

  const [dailyLogs, setDailyLogs] = useState<DailyLogType[]>([]);
  const [events, setEvents] = useState<CalendarEventType[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  const [currentMonth, setCurrentMonth] = useState(new Date());

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [selectedDateForModal, setSelectedDateForModal] = useState<Date | null>(
    null,
  );

  const refreshCalendar = useCalendarStore((state) => state.refreshCalendar);
  const resetCalendarRefresh = useCalendarStore(
    (state) => state.resetCalendarRefresh,
  );

  const loadDailyLogs = useCallback(async () => {
    const start = startOfDay(
      subDays(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1),
        7,
      ),
    );

    const end = endOfDay(
      addDays(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0),
        7,
      ),
    );

    const dailyLogs = await getDailyLogsByDate(start, end);
    const calendarEvents = await getCalendarEvents(start, end);
    const goals = await getDailyGoalByRangeDate(start, end);

    setEvents(calendarEvents);
    setDailyLogs(dailyLogs);
    setGoals(goals);
  }, [currentMonth]);

  const onDayClick = (date: Date) => {
    setSelectedDateForModal(date);
    setCreateModalOpen(true);
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

  const dayMap = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

  const getGoalForDate = (date: Date) => {
    if (!date || !goals) return [];

    const dayString = dayMap[date.getDay()];

    return goals.filter((item) => {
      const start = new Date(item.start_date);
      const end = new Date(item.end_date);

      if (date < start || date > end) return false;

      if (!item.repeat_days || item.repeat_days.length === 0) return true;
      return item.repeat_days.includes(dayString);
    });
  };

  return (
    <div className="w-full max-w-5xl mx-auto">
      <Card>
        <CardHeader className="flex flex-row justify-between items-center">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
          >
            <ChevronLeft className="w-5 h-5" />
          </Button>
          <CardTitle>{format(currentMonth, "MMMM yyyy")}</CardTitle>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          >
            <ChevronRight className="w-5 h-5" />
          </Button>
        </CardHeader>

        <CardContent className={isMobile ? "px-0" : ""}>
          <DayPicker
            mode="single"
            month={currentMonth}
            onMonthChange={(month) => setCurrentMonth(month)}
            showOutsideDays
            hideNavigation
            className="p-0 w-full"
            classNames={{
              month_caption: "hidden",
              months: "w-full",
              month: "w-full space-y-4",
              month_grid:
                "w-full border-4 border-slate-200 border-collapse rounded-xl table-fixed",
              weekdays: "w-full",
              weekday:
                "font-medium text-center text-sm bg-slate-200 py-2 font-bold w-[14.285%]",
              week: "w-full",
              day: "h-[100px] md:h-[130px] lg:h-[130px] text-sm p-0 relative border-2 border-slate-200 w-[14.285%]",
              day_button: "h-full w-full p-2 font-normal",
              outside: "text-gray-400",
            }}
            formatters={{
              formatWeekdayName: (date) => format(date, "EEE"),
            }}
            components={{
              DayButton: (props) => {
                const { day } = props;
                const date = day.date;

                if (!date) {
                  return <div aria-hidden />;
                }

                const dailyLog = getDailyLogForDate(date);
                const dayEvents = getEventForDate(date);
                const dayGoals = getGoalForDate(date);
                const isToday = isSameDay(date, new Date());
                const isOutside = !isSameMonth(date, currentMonth);

                return (
                  <div
                    tabIndex={0}
                    className={cn(
                      "h-full w-full p-2 flex flex-col group hover:bg-slate-50",
                      isToday && "bg-slate-100",
                      isOutside && "text-gray-400",
                    )}
                  >
                    <div className="flex justify-between items-center w-full mb-1">
                      <div className="flex items-center gap-2">
                        <span
                          className={cn(
                            "text-xs",
                            isToday &&
                              "rounded-full border-2 border-sky-200 px-1 bg-sky-200",
                          )}
                        >
                          {date.getDate()}
                        </span>

                        {!isMobile && (
                          <div className="flex flex-row gap-1">
                            {dayGoals.map((goal: Goal) => (
                              <div
                                key={goal.id}
                                className="w-5 h-5 flex items-center justify-center rounded-full bg-sky-50 border border-sky-200 text-xs shadow-md"
                              >
                                {goal.emoji}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>

                      <Button
                        variant="outline"
                        size="icon"
                        className="invisible group-hover:visible w-6 h-6 flex items-center justify-center"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDayClick(date);
                        }}
                      >
                        <CalendarPlus className="w-3 h-3" />
                      </Button>
                    </div>
                    <div className="flex-grow overflow-hidden">
                      <CalendarDayCell events={dayEvents} dailyLog={dailyLog} />
                    </div>
                  </div>
                );
              },
            }}
          />

          {selectedDateForModal && (
            <CreateEventModal
              selectedDate={selectedDateForModal}
              open={createModalOpen}
              onOpenChange={setCreateModalOpen}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default Calendar;
