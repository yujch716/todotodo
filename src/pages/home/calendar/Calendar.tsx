import { DayPicker } from "react-day-picker";
import { fetchChecklistByDate } from "@/api/checklist.ts";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card.tsx";

type Checklist = {
  id: string;
  title: string;
  date: string;
};

const ChecklistCalendar = () => {
  const [checklists, setChecklists] = useState<Checklist[]>([]);
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

  const getTitlesForDate = (date: Date) => {
    return checklists
      .filter(
        (item) => new Date(item.date).toDateString() === date.toDateString(),
      )
      .map((item) => item.title);
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
            "font-medium text-center text-sm text-muted-foreground bg-sky-100 py-2",
          row: "",
          cell: "h-[90px] md:h-[110px] lg:h-[130px] text-sm p-0 relative border-2 border-sky-100 p-2",
          day: "h-full w-full p-1 font-normal flex flex-col items-center justify-start text-sm",
          day_selected: "bg-primary text-white hover:bg-primary/90",
          day_today: "border border-primary font-bold",
        }}
        components={{
          Day: (dayProps: any) => {
            const { date, className, onClick, onKeyDown, onFocus, onBlur } =
              dayProps;
            const titles = getTitlesForDate(date);

            return (
              <div
                className={cn(className, "flex flex-col h-full")}
                onClick={onClick}
                onKeyDown={onKeyDown}
                onFocus={onFocus}
                onBlur={onBlur}
                tabIndex={0}
              >
                <div className="flex pb-2">
                  <span className="text-xs">{date.getDate()}</span>
                </div>
                <div className="">
                  {titles.length > 0 && (
                    <ul className="text-[11px] leading-tight text-muted-foreground">
                      {titles.map((title, i) => (
                        <Card className="p-1 mb-1">
                          <li key={i} className="truncate w-full">
                            {title}
                          </li>
                        </Card>
                      ))}
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
