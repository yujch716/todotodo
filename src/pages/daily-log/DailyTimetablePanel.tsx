import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { CalendarClock, X } from "lucide-react";
import CreateDailyTimetableModal from "@/pages/daily-log/CreateDailyTimetableModal.tsx";
import {
  deleteDailyTimetableById,
  getDailyTimeTables,
} from "@/api/daily-timetable.ts";
import type { DailyTimetableType } from "@/types/daily-log.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDailyTimetableStore } from "@/store/dailyTimetableStore.ts";
import { increaseSaturationAndDarken } from "@/lib/color.ts";
import { Button } from "@/components/ui/button.tsx";

interface Props {
  dailyLogId: string;
}

const DailyTimetablePanel = ({ dailyLogId }: Props) => {
  const [timetables, setTimetables] = useState<DailyTimetableType[]>([]);
  const [hoveredTimetableId, setHoveredTimetableId] = useState<string | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);
  const ROW_HEIGHT = 20;

  const hours = Array.from({ length: 24 }, (_, i) => i);

  const triggerTimeTableRefresh = useDailyTimetableStore(
    (state) => state.triggerDailyTimetableRefresh,
  );

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

  // 시간을 분 단위로 변환
  const timeToMinutes = (time: string): number => {
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
  };

  // 특정 30분 슬롯에 해당하는 타임테이블 찾기
  const getTimetableForHalfHour = (hour: number, isSecondHalf: boolean) => {
    const slotMinutes = hour * 60 + (isSecondHalf ? 30 : 0);

    return timetables.find((tt) => {
      const startMinutes = timeToMinutes(tt.start_time);
      const endMinutes = timeToMinutes(tt.end_time);

      if (startMinutes === endMinutes) {
        return slotMinutes === startMinutes;
      }

      if (startMinutes < endMinutes) {
        return slotMinutes >= startMinutes && slotMinutes < endMinutes;
      }

      return slotMinutes >= startMinutes || slotMinutes < endMinutes;
    });
  };

  // 타임테이블의 시작 슬롯인지 확인
  const isStartSlot = (
    hour: number,
    isSecondHalf: boolean,
    timetable?: DailyTimetableType,
  ) => {
    if (!timetable) return false;
    const [startHour, startMinute] = timetable.start_time
      .split(":")
      .map(Number);
    return (
      hour === startHour &&
      (isSecondHalf ? startMinute === 30 : startMinute === 0)
    );
  };

  const deleteTimetable = async (id: string) => {
    await deleteDailyTimetableById(id);
    triggerTimeTableRefresh();
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollTop === 0) {
      el.scrollTop = 7 * 80; // 7시 위치로 스크롤 (행당 높이 * 2)
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
          <div className="grid grid-cols-[56px_1fr]">
            {hours.flatMap((hour) =>
              [0, 1].map((halfIndex) => {
                const isSecondHalf = halfIndex === 1;
                const timetable = getTimetableForHalfHour(hour, isSecondHalf);
                const isStart = isStartSlot(hour, isSecondHalf, timetable);
                const showDeleteButton =
                  timetable && hoveredTimetableId === timetable.id;

                return (
                  <div key={`${hour}-${halfIndex}`} className="contents">
                    {/* 시간 컬럼 */}
                    {halfIndex === 0 ? (
                      <div
                        className="row-span-2 border-r border-b text-xs flex items-center p-2"
                        style={{ height: ROW_HEIGHT * 2 }}
                      >
                        {String(hour).padStart(2, "0")}:00
                      </div>
                    ) : null}

                    {/* 슬롯 */}
                    <div
                      className={`relative ${
                        halfIndex === 1 ? "border-b" : ""
                      }`}
                      style={{ height: ROW_HEIGHT }}
                      onMouseEnter={() =>
                        timetable && setHoveredTimetableId(timetable.id)
                      }
                      onMouseLeave={() => setHoveredTimetableId(null)}
                    >
                      {/* 배경 */}
                      {timetable && (
                        <div
                          className="absolute inset-0 border-l-4"
                          style={
                            timetable.category
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
                          }
                        />
                      )}

                      {/* 🔥 오버레이 (진짜 핵심) */}
                      {isStart && timetable && (
                        <div className="absolute inset-x-2 -top-2 z-10 flex items-center justify-between pointer-events-none">
                          <span className="text-sm font-medium truncate max-w-[80%] p-4">
                            {timetable.content}
                          </span>

                          {showDeleteButton && (
                            <Button
                              variant="outline"
                              size="icon"
                              className="h-5 w-5 rounded-full bg-white pointer-events-auto border-slate-400"
                              onClick={() => deleteTimetable(timetable.id)}
                            >
                              <X size={12} />
                            </Button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                );
              }),
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
export default DailyTimetablePanel;
