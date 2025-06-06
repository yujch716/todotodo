import { DayPicker } from "react-day-picker";
import { fetchChecklistByDate } from "@/api/checklist.ts";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card.tsx";
import type { ChecklistType } from "@/types/checklist.ts";
import { ChecklistStatusIcon } from "@/components/ChecklistStatusIcon.tsx";
import { format, isSameDay } from "date-fns";
import {useNavigate} from "react-router-dom";

const ChecklistCalendar = () => {
    const navigate = useNavigate();

  const [checklists, setChecklists] = useState<ChecklistType[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  useEffect(() => {
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

    const fetchChecklists = async () => {
      const checklist = await fetchChecklistByDate(start, end);
      setChecklists(checklist);
    };

    fetchChecklists();
  }, [currentMonth]);

  const getChecklistsForDate = (date: Date) => {
    return checklists.filter(
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
          table: "w-full border-4 border-sky-100 border-collapse table-fixed",
          head_row: "",
          head_cell:
            "font-medium text-center text-sm bg-sky-100 py-2 font-bold",
          row: "",
          cell: "h-[90px] md:h-[110px] lg:h-[130px] text-sm p-0 relative border-2 border-sky-100",
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
            const checklistsForDate = getChecklistsForDate(date);
              const isToday = isSameDay(date, new Date());

            return (
              <div
                  className={cn(
                      className,
                      "flex flex-col h-full p-2",
                      isToday && "bg-sky-50"
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
                          "rounded-full border-2 border-sky-200 px-1 bg-sky-200"
                      )}
                  >
                    {date.getDate()}
                  </span>
                </div>
                <div>
                  {checklistsForDate.length > 0 && (
                    <ul className="text-[11px] leading-tight">
                      {checklistsForDate.map((item, i) => {
                        return (
                          <Card key={i} className="p-1 mb-1 hover:bg-slate-50" onClick={() => navigate(`/checklist?id=${item.id}`)}>
                            <li className="truncate w-full text-muted-foreground flex items-center gap-1">
                              <ChecklistStatusIcon
                                checkedCount={item.checkedCount}
                                totalCount={item.totalCount}
                              />
                              {item.title}
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

export default ChecklistCalendar;
