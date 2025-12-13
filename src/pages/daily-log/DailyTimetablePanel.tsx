import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { CalendarClock } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from "@/components/ui/table.tsx";
import CreateDailyTimetableModal from "@/pages/daily-log/CreateDailyTimetableModal.tsx";
import { getDailyTimeTables } from "@/api/daily-timetable.ts";
import type { DailyTimetableType } from "@/types/daily-log.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDailyTimetableStore } from "@/store/dailyTimetableStore.ts";
import { increaseSaturationAndDarken } from "@/lib/color.ts";

interface Props {
  dailyLogId: string;
}

const DailyTimetablePanel = ({ dailyLogId }: Props) => {
  const [timetables, setTimetables] = useState<DailyTimetableType[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  const hours = Array.from({ length: 24 }, (_, i) => (i + 0) % 24);

  const refreshTimetables = useDailyTimetableStore(
    (state) => state.refreshDailyTimetable,
  );
  const resetTimetablesRefresh = useDailyTimetableStore(
    (state) => state.resetDailyTimetableRefresh,
  );

  const loadDailyTimeTables = useCallback(async () => {
    const timetables = await getDailyTimeTables(dailyLogId);
    setTimetables(timetables);
  }, [dailyLogId]);

  const getTimetableForHour = (hour: number) => {
    return timetables.find((tt) => {
      const startHour = parseInt(tt.start_time.split(":")[0]);
      const endHour = parseInt(tt.end_time.split(":")[0]);

      if (startHour === endHour) return hour === startHour;

      if (startHour < endHour) {
        return hour >= startHour && hour < endHour;
      }

      return hour >= startHour || hour < endHour;
    });
  };

  const isStartHour = (hour: number, timetable?: DailyTimetableType) => {
    if (!timetable) return false;
    const startHour = parseInt(timetable.start_time.split(":")[0]);
    return hour === startHour;
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollTop === 0) {
      el.scrollTop = 7 * 40;
    }
  }, [timetables]);

  useEffect(() => {
    loadDailyTimeTables();
  }, [loadDailyTimeTables]);

  useEffect(() => {
    if (refreshTimetables) {
      loadDailyTimeTables();
      resetTimetablesRefresh();
    }
  }, [refreshTimetables, loadDailyTimeTables, resetTimetablesRefresh]);

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden shadow-lg border-1">
        <CardHeader>
          <CardTitle className="text-base">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CalendarClock /> Timeline
              </div>

              <CreateDailyTimetableModal
                dailyLogId={dailyLogId}
                timetables={timetables}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent ref={scrollRef} className="flex-grow overflow-y-auto">
          <Table>
            <TableBody>
              {hours.map((hour) => {
                const timetable = getTimetableForHour(hour);
                const isStart = isStartHour(hour, timetable);
                const hasContent = !!timetable;

                return (
                  <TableRow key={hour} className="h-10 [&>td]:py-0 [&>td]:px-2">
                    <TableCell className="border-r w-[1%] whitespace-nowrap">
                      {String(hour).padStart(2, "0")}:00
                    </TableCell>
                    <TableCell
                      className={hasContent ? "border-l-4" : ""}
                      style={
                        hasContent
                          ? timetable?.category
                            ? {
                                backgroundColor: timetable.category.color,
                                borderLeftColor: increaseSaturationAndDarken(
                                  timetable.category.color,
                                ),
                              }
                            : {
                                backgroundColor: "#f1f5f9",
                                borderLeftColor: "#cbd5e1",
                              }
                          : undefined
                      }
                    >
                      {isStart && timetable && (
                        <span className="font-medium">{timetable.content}</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </>
  );
};
export default DailyTimetablePanel;
