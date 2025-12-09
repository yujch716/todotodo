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
import CreateDailyTimelineModal from "@/pages/daily-log/CreateDailyTimelineModal.tsx";
import { getDailyTimeTables } from "@/api/daily-timetable.ts";
import type { DailyTimetableType } from "@/types/daily-log.ts";
import { useEffect, useState } from "react";

interface Props {
  dailyLogId: string;
}

const TimetablePanel = ({ dailyLogId }: Props) => {
  const [timetables, setTimetables] = useState<DailyTimetableType[]>([]);

  const hours = Array.from({ length: 24 }, (_, i) => (i + 7) % 24);

  const loadDailyTimeTable = async () => {
    const timetables = await getDailyTimeTables(dailyLogId);
    setTimetables(timetables);
  };

  const getTimetableForHour = (hour: number) => {
    return timetables.find((tt) => {
      const startHour = parseInt(tt.start_time.split(":")[0]);
      const endHour = parseInt(tt.end_time.split(":")[0]);
      return hour >= startHour && hour < endHour;
    });
  };

  const isStartHour = (hour: number, timetable?: DailyTimetableType) => {
    if (!timetable) return false;
    const startHour = parseInt(timetable.start_time.split(":")[0]);
    return hour === startHour;
  };

  useEffect(() => {
    loadDailyTimeTable();
  }, [dailyLogId]);

  return (
    <>
      <Card className="flex flex-col h-full overflow-hidden shadow-lg border-1">
        <CardHeader>
          <CardTitle className="text-base">
            <div className="flex items-center justify-between w-full">
              <div className="flex items-center gap-2">
                <CalendarClock /> Timeline
              </div>

              <CreateDailyTimelineModal
                dailyLogId={dailyLogId}
                timetables={timetables}
              />
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent className="flex-grow overflow-x-auto">
          <Table>
            <TableBody>
              {hours.map((hour) => {
                const timetable = getTimetableForHour(hour);
                const isStart = isStartHour(hour, timetable);
                const hasContent = !!timetable;

                return (
                  <TableRow key={hour}>
                    <TableCell className="border-r w-[1%] whitespace-nowrap">
                      {String(hour).padStart(2, "0")}:00
                    </TableCell>
                    <TableCell
                      className={
                        hasContent
                          ? "bg-blue-100 border-l-4 border-l-blue-500"
                          : ""
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
export default TimetablePanel;
