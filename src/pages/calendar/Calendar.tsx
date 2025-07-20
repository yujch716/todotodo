import { DayPicker } from "react-day-picker";
import { getDailyLogsByDate } from "@/api/daily-log.ts";
import { useCallback, useEffect, useState } from "react";
import { cn } from "@/lib/utils.ts";
import { Card } from "@/components/ui/card.tsx";
import type { DailyLogType } from "@/types/daily-log.ts";
import { DailyLogStatusIcon } from "@/components/DailyLogStatusIcon.tsx";
import { format, isSameDay } from "date-fns";
import { useNavigate } from "react-router-dom";
import { useCalendarStore } from "@/store/calendarStore.ts";

const Calendar = () => {
  const navigate = useNavigate();

  const [dailyLogs, setDailyLogs] = useState<DailyLogType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

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

    const data = await getDailyLogsByDate(start, end);
    setDailyLogs(data);
  }, [currentMonth]);

  useEffect(() => {
    loadDailyLogs();
  }, [loadDailyLogs]);

  useEffect(() => {
    if (refreshCalendar) {
      loadDailyLogs();
      resetCalendarRefresh();
    }
  }, [refreshCalendar, loadDailyLogs, resetCalendarRefresh]);

  const getDailyLogsForDate = (date: Date) => {
    return dailyLogs.filter(
      (item) => new Date(item.date).toDateString() === date.toDateString(),
    );
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <DayPicker
        mode="single"
        month={currentMonth}
        onMonthChange={(month) => setCurrentMonth(month)}
        showOutsideDays
        className="p-0"
        classNames={{
          months: "flex flex-col sm:flex-row gap-4",
          month: "space-y-4",
          caption: "flex justify-between items-center px-2",
          table: "w-full border-4 border-slate-200 border-collapse table-fixed",
          head_row: "",
          head_cell:
            "font-medium text-center text-sm bg-slate-200 py-2 font-bold",
          row: "",
          cell: "h-[90px] md:h-[110px] lg:h-[130px] text-sm p-0 relative border-2 border-slate-200",
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
            const dailyLogsForDate = getDailyLogsForDate(date);
            const isToday = isSameDay(date, new Date());

            return (
              <div
                className={cn(
                  className,
                  "flex flex-col h-full p-2",
                  isToday && "bg-slate-100",
                )}
                onClick={onClick}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                tabIndex={0}
              >
                <div className="flex pb-2">
                  <span
                    className={cn(
                      "text-xs",
                      isToday &&
                        "rounded-full border-2 border-sky-200 px-1 bg-sky-200",
                    )}
                  >
                    {date.getDate()}
                  </span>
                </div>
                <div>
                  {dailyLogsForDate.length > 0 && (
                    <ul className="text-[11px] leading-tight">
                      {dailyLogsForDate.map((item, i) => {
                        return (
                          <Card
                            key={i}
                            className="p-1 mb-1 hover:bg-slate-50"
                            onClick={() => navigate(`/daily?id=${item.id}`)}
                          >
                            <li className="truncate w-full text-muted-foreground flex items-center gap-1">
                              <DailyLogStatusIcon
                                checkedCount={item.checkedCount}
                                totalCount={item.totalCount}
                              />
                              Daily
                            </li>
                          </Card>
                        );
                      })}
                    </ul>
                  )}
                </div>
              </div>
            );
          },
        }}
      />
    </div>
  );
};

export default Calendar;
