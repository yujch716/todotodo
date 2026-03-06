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
import { Button } from "@/components/ui/button.tsx";
import { withAlpha } from "@/lib/color.ts";

interface Props {
  dailyLogId: string;
}

const MINUTES_PER_CELL = 10;
const CELLS_PER_HOUR = 6;
const ROW_HEIGHT = 40;
const TIME_COL_WIDTH = 56;

const DailyTimetablePanel = ({ dailyLogId }: Props) => {
  const [timetables, setTimetables] = useState<DailyTimetableType[]>([]);
  const [hoveredTimetableId, setHoveredTimetableId] = useState<string | null>(
    null,
  );
  const scrollRef = useRef<HTMLDivElement>(null);

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
    const data = await getDailyTimeTables(dailyLogId);
    setTimetables(data);
  }, [dailyLogId]);

  const timeToMinutes = (time: string): number => {
    const [h, m] = time.split(":").map(Number);
    return h * 60 + m;
  };

  const deleteTimetable = async (id: string) => {
    await deleteDailyTimetableById(id);
    triggerTimeTableRefresh();
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (el && el.scrollTop === 0) {
      el.scrollTop = 7 * ROW_HEIGHT;
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

  /**
   * 한 timetable을 hour-row별 세그먼트로 분해
   * 예) 07:00~13:00 → hour 7~12 각각 { hour, startCell, endCell }
   * startCell: 그 행에서 색칠 시작 셀 (0~5)
   * endCell: 그 행에서 색칠 끝 셀 (exclusive, 1~6)
   */
  const getSegments = (tt: DailyTimetableType) => {
    const startMin = timeToMinutes(tt.start_time);
    const endMin = timeToMinutes(tt.end_time);

    const segments: {
      hour: number;
      startCell: number;
      endCell: number;
      isFirst: boolean;
    }[] = [];

    let current = startMin;
    let isFirst = true;

    while (current < endMin) {
      const hour = Math.floor(current / 60);
      const minuteInHour = current % 60;
      const startCell = Math.floor(minuteInHour / MINUTES_PER_CELL);

      // 이 행에서 끝나는 분: 다음 시 정각 or endMin 중 작은 값
      const rowEndMin = Math.min((hour + 1) * 60, endMin);
      const endCell = Math.ceil((rowEndMin - hour * 60) / MINUTES_PER_CELL);

      segments.push({ hour, startCell, endCell, isFirst });
      isFirst = false;
      current = (hour + 1) * 60; // 다음 행으로
    }

    return segments;
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg border-1">
      <CardHeader>
        <CardTitle className="text-base">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CalendarClock /> Timetable
            </div>
            <CreateDailyTimetableModal
              dailyLogId={dailyLogId}
              timetables={timetables}
            />
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent ref={scrollRef} className="flex-grow overflow-y-auto">
        <div className="relative">
          <div
            className="grid"
            style={{
              gridTemplateColumns: `${TIME_COL_WIDTH}px repeat(${CELLS_PER_HOUR}, 1fr)`,
            }}
          >
            {hours.map((hour) => (
              <>
                <div
                  key={`label-${hour}`}
                  className="border-r border-b text-xs flex items-center justify-center text-gray-600 font-medium"
                  style={{
                    height: ROW_HEIGHT,
                    borderBottom: hour === 23 ? "none" : undefined,
                  }}
                >
                  {String(hour).padStart(2, "0")}:00
                </div>
                {Array.from({ length: CELLS_PER_HOUR }, (_, cellIndex) => (
                  <div
                    key={`cell-${hour}-${cellIndex}`}
                    className="border-r border-b"
                    style={{
                      height: ROW_HEIGHT,
                      borderRight:
                        cellIndex === CELLS_PER_HOUR - 1 ? "none" : undefined,
                      borderBottom: hour === 23 ? "none" : undefined,
                    }}
                  />
                ))}
              </>
            ))}
          </div>

          {/* ── 2) timetable 오버레이 레이어 ── */}
          {timetables.map((tt) => {
            const segments = getSegments(tt);
            const bgColor = tt.category?.color ?? "#f1f5f9";
            const isHovered = hoveredTimetableId === tt.id;

            return segments.map(({ hour, startCell, endCell, isFirst }) => {
              // left: TIME_COL_WIDTH + startCell 비율
              // width: (endCell - startCell) 비율
              // 전체 content 영역(6칸) 중 몇 칸인지
              const leftPercent = (startCell / CELLS_PER_HOUR) * 100;
              const widthPercent =
                ((endCell - startCell) / CELLS_PER_HOUR) * 100;

              return (
                <div
                  key={`${tt.id}-${hour}`}
                  className="absolute flex items-center overflow-hidden"
                  style={{
                    top: hour * ROW_HEIGHT,
                    height: ROW_HEIGHT,
                    left: `calc(${TIME_COL_WIDTH}px + (100% - ${TIME_COL_WIDTH}px) * ${leftPercent / 100})`,
                    width: `calc((100% - ${TIME_COL_WIDTH}px) * ${widthPercent / 100})`,
                    backgroundColor: withAlpha(bgColor, 0.7),
                    zIndex: 10,
                  }}
                  onMouseEnter={() => setHoveredTimetableId(tt.id)}
                  onMouseLeave={() => setHoveredTimetableId(null)}
                >
                  {isFirst && (
                    <div className="flex items-center justify-between w-full px-2 overflow-hidden">
                      <span className="text-xs font-medium truncate flex-1">
                        {tt.content}
                      </span>
                      {isHovered && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-5 w-5 rounded-full bg-white border-slate-400 flex-shrink-0 ml-1 shadow-md"
                          onClick={() => deleteTimetable(tt.id)}
                        >
                          <X size={12} />
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              );
            });
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTimetablePanel;
