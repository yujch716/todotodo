import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx";
import { CalendarClock, X } from "lucide-react";
import CreateDailyTimetableModal from "@/pages/daily-log/timetable/CreateDailyTimetableModal.tsx";
import EditDailyTimetableModal from "@/pages/daily-log/timetable/EditDailyTimetableModal.tsx";
import {
  deleteDailyTimetableById,
  getDailyTimeTables,
} from "@/api/daily-timetable.ts";
import type { DailyTimetableType } from "@/types/daily-log.ts";
import { useCallback, useEffect, useRef, useState } from "react";
import { useDailyTimetableStore } from "@/store/dailyTimetableStore.ts";
import { Button } from "@/components/ui/button.tsx";
import { withAlpha, darken } from "@/lib/color.ts";

interface Props {
  dailyLogId: string;
}

const MINUTES_PER_CELL = 10;
const CELLS_PER_HOUR = 6;
const ROW_HEIGHT = 40;
const TIME_COL_WIDTH = 56;
const START_HOUR = 4;

const DailyTimetablePanel = ({ dailyLogId }: Props) => {
  const [timetables, setTimetables] = useState<DailyTimetableType[]>([]);
  const [hoveredTimetableId, setHoveredTimetableId] = useState<string | null>(
    null,
  );
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedTimetable, setSelectedTimetable] =
    useState<DailyTimetableType | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  // 04시부터 다음날 04시까지 24시간
  const timeSlots = Array.from({ length: 24 }, (_, i) => {
    const hour = (START_HOUR + i) % 24;
    return { hour };
  });

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
    const adjustedHour = h < START_HOUR ? h + 24 : h;
    return (adjustedHour - START_HOUR) * 60 + m;
  };

  const deleteTimetable = async (id: string) => {
    await deleteDailyTimetableById(id);
    triggerTimeTableRefresh();
  };

  const handleTimetableClick = (timetable: DailyTimetableType) => {
    setSelectedTimetable(timetable);
    setEditModalOpen(true);
  };

  useEffect(() => {
    loadDailyTimeTables();
  }, [loadDailyTimeTables]);

  useEffect(() => {
    if (refreshTimetables) {
      loadDailyTimeTables();
      resetTimetablesRefresh();
    }
  }, [refreshTimetables, loadDailyTimeTables, resetTimetablesRefresh]);

  const getSegments = (tt: DailyTimetableType) => {
    const startMin = timeToMinutes(tt.start_time);
    const endMin = timeToMinutes(tt.end_time);

    const actualEndMin = endMin <= startMin ? endMin + 24 * 60 : endMin;

    const segments: {
      rowIndex: number;
      startCell: number;
      endCell: number;
      isFirst: boolean;
    }[] = [];

    let current = startMin;
    let isFirst = true;

    while (current < actualEndMin) {
      const rowIndex = Math.floor(current / 60);
      const minuteInHour = current % 60;
      const startCell = Math.floor(minuteInHour / MINUTES_PER_CELL);

      const rowEndMin = Math.min((rowIndex + 1) * 60, actualEndMin);
      const endCell = Math.ceil((rowEndMin - rowIndex * 60) / MINUTES_PER_CELL);

      if (rowIndex < 24) {
        segments.push({ rowIndex, startCell, endCell, isFirst });
      }

      isFirst = false;
      current = (rowIndex + 1) * 60;
    }

    return segments;
  };

  // getSegmentLayout 삭제하고 이걸로 교체
  const getSegmentsWithLayout = (timetables: DailyTimetableType[]) => {
    const allBaseSegs = timetables.flatMap((tt) =>
      getSegments(tt).map((seg) => ({ ...seg, ttId: tt.id })),
    );

    const byRow: Record<number, typeof allBaseSegs> = {};
    allBaseSegs.forEach((seg) => {
      if (!byRow[seg.rowIndex]) byRow[seg.rowIndex] = [];
      byRow[seg.rowIndex].push(seg);
    });

    type RenderSeg = {
      ttId: string;
      rowIndex: number;
      startCell: number;
      endCell: number;
      isFirst: boolean;
      lane: number;
      totalLanes: number;
    };

    const result: RenderSeg[] = [];

    Object.entries(byRow).forEach(([rowStr, segs]) => {
      const rowIndex = Number(rowStr);

      const boundaries = Array.from(
        new Set(segs.flatMap((s) => [s.startCell, s.endCell])),
      ).sort((a, b) => a - b);

      for (let bi = 0; bi < boundaries.length - 1; bi++) {
        const cellStart = boundaries[bi];
        const cellEnd = boundaries[bi + 1];

        const coveringSegs = segs
          .filter((s) => s.startCell <= cellStart && s.endCell >= cellEnd)
          .sort((a, b) => a.ttId.localeCompare(b.ttId)); // 안정적 lane 순서

        const totalLanes = coveringSegs.length;

        coveringSegs.forEach((seg, i) => {
          result.push({
            ttId: seg.ttId,
            rowIndex,
            startCell: cellStart,
            endCell: cellEnd,
            isFirst: seg.isFirst && cellStart === seg.startCell,
            lane: i,
            totalLanes,
          });
        });
      }
    });

    return result;
  };

  return (
    <Card className="flex flex-col h-full overflow-hidden shadow-lg border-1">
      <CardHeader>
        <CardTitle className="text-base">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-2">
              <CalendarClock /> Timetable
            </div>
            <CreateDailyTimetableModal dailyLogId={dailyLogId} />
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
            {timeSlots.map(({ hour }, index) => (
              <>
                <div
                  key={`label-${index}`}
                  className="border-r border-b text-xs flex items-center justify-center text-gray-600 font-medium relative"
                  style={{
                    height: ROW_HEIGHT,
                    borderBottom: index === 23 ? "none" : undefined,
                  }}
                >
                  <div className="flex flex-col items-center">
                    <span>{String(hour).padStart(2, "0")}:00</span>
                  </div>
                </div>
                {Array.from({ length: CELLS_PER_HOUR }, (_, cellIndex) => (
                  <div
                    key={`cell-${index}-${cellIndex}`}
                    className="border-r border-b"
                    style={{
                      height: ROW_HEIGHT,
                      borderRight:
                        cellIndex === CELLS_PER_HOUR - 1 ? "none" : undefined,
                      borderBottom: index === 23 ? "none" : undefined,
                    }}
                  />
                ))}
              </>
            ))}
          </div>

          {(() => {
            const renderSegs = getSegmentsWithLayout(timetables);

            return renderSegs.map(
              ({
                ttId,
                rowIndex,
                startCell,
                endCell,
                isFirst,
                lane,
                totalLanes,
              }) => {
                const tt = timetables.find((t) => t.id === ttId)!;
                const bgColor = tt.category?.color ?? "#ededed";
                const isHovered = hoveredTimetableId === ttId;

                const hoveredBgColor = isHovered
                  ? withAlpha(darken(bgColor, 0.02), 0.8)
                  : withAlpha(bgColor, 0.8);

                const leftPercent = (startCell / CELLS_PER_HOUR) * 100;
                const widthPercent =
                  ((endCell - startCell) / CELLS_PER_HOUR) * 100;
                const segHeight = ROW_HEIGHT / totalLanes;
                const segTop = rowIndex * ROW_HEIGHT + lane * segHeight;

                return (
                  <div
                    key={`${ttId}-${rowIndex}-${startCell}-${endCell}`}
                    className="absolute flex items-center overflow-hidden transition-all duration-200 cursor-pointer"
                    style={{
                      top: segTop,
                      height: segHeight,
                      left: `calc(${TIME_COL_WIDTH}px + (100% - ${TIME_COL_WIDTH}px) * ${leftPercent / 100})`,
                      width: `calc((100% - ${TIME_COL_WIDTH}px) * ${widthPercent / 100})`,
                      backgroundColor: hoveredBgColor,
                      zIndex: isHovered ? 20 : 10,
                    }}
                    onMouseEnter={() => setHoveredTimetableId(ttId)}
                    onMouseLeave={() => setHoveredTimetableId(null)}
                    onClick={() => handleTimetableClick(tt)}
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
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteTimetable(ttId);
                            }}
                          >
                            <X size={12} />
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              },
            );
          })()}
        </div>
      </CardContent>

      <EditDailyTimetableModal
        open={editModalOpen}
        onOpenChange={setEditModalOpen}
        timetable={selectedTimetable}
      />
    </Card>
  );
};

export default DailyTimetablePanel;
