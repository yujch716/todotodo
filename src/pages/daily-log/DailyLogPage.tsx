import { useNavigate, useParams } from "react-router-dom";
import DailyTodoPanel from "@/pages/daily-log/DailyTodoPanel.tsx";
import MemoPanel from "@/pages/daily-log/MemoPanel.tsx";
import { useCallback, useEffect, useState } from "react";
import {
  deleteDailyLogById,
  getDailyLogById,
  getDailyLogsByDate,
} from "@/api/daily-log.ts";
import { Trash2 } from "lucide-react";
import { useDailyLogSidebarStore } from "@/store/dailyLogSidebarStore.ts";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs.tsx";
import DailyNoticePanel from "@/pages/daily-log/DailyNoticePanel.tsx";
import { Calendar } from "@/components/ui/calendar.tsx";
import { format } from "date-fns";
import DailyTimetablePanel from "@/pages/daily-log/DailyTimetablePanel.tsx";
import DailyEmptyPage from "@/pages/daily-log/DailyEmptyPage.tsx";

const DailyLogPage = () => {
  const navigate = useNavigate();

  const { id: dailyLogId } = useParams();

  const [isSmall, setIsSmall] = useState(false);
  const [logsByDate, setLogsByDate] = useState<Record<string, string>>({});
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [memo, setMemo] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const isValidLog = dailyLogId && dailyLogId !== "undefined" && date;

  const triggerSidebarRefresh = useDailyLogSidebarStore(
    (state) => state.triggerSidebarRefresh,
  );

  const toYMD = useCallback((d: Date | string) => {
    const dt = typeof d === "string" ? new Date(d) : d;
    return format(dt, "yyyy-MM-dd");
  }, []);

  const loadDailyLog = useCallback(async () => {
    if (!dailyLogId || dailyLogId === "undefined") return;

    const dailyLog = await getDailyLogById(dailyLogId);

    setDate(new Date(dailyLog.date));
    setMemo(dailyLog.memo || "");
  }, [dailyLogId]);

  const loadDailyLogs = useCallback(async () => {
    if (!date) return;
    const start = new Date(date.getFullYear(), date.getMonth(), 1);
    const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);

    const dailyLogs = await getDailyLogsByDate(start, end);

    const map: Record<string, string> = {};
    dailyLogs.forEach((log) => {
      const key = toYMD(log.date);
      map[key] = log.id;
    });

    setLogsByDate(map);
  }, [date, toYMD]);

  const handleDelete = async () => {
    if (!dailyLogId) return;
    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dailyLogId) return;
    setIsAlertOpen(false);

    await deleteDailyLogById(dailyLogId);

    triggerSidebarRefresh();
    navigate("/calendar");
  };

  const handleDateSelect = useCallback(
    (selectedDate: Date | undefined) => {
      if (!selectedDate) return;

      setDate(new Date(selectedDate));

      const key = toYMD(selectedDate);
      const logId = logsByDate[key];

      if (logId) {
        navigate(`/daily/${logId}`);
      } else {
        navigate(`/daily/undefined`);
      }
    },
    [logsByDate, toYMD, navigate],
  );

  useEffect(() => {
    loadDailyLog();
  }, [loadDailyLog]);

  useEffect(() => {
    loadDailyLogs();
  }, [loadDailyLogs]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 1023px)");

    const handleChange = (e: MediaQueryListEvent) => {
      setIsSmall(e.matches);
    };

    setIsSmall(mediaQuery.matches);

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return (
    <>
      <div
        className={`
          flex flex-col w-full
          ${isSmall ? "min-h-fit overflow-visible" : "h-full"}
        `}
      >
        <header className="flex w-full gap-8 mb-5 items-center">
          <div className="w-1/2">
            <div className="text-sm text-gray-500 mb-1">
              {date ? format(date, "yyyy-MM-dd") : null}
            </div>
          </div>

          <div className="w-1/2 flex items-center gap-2">
            <div
              className="ml-auto cursor-pointer hover:text-red-600"
              onClick={handleDelete}
            >
              {isValidLog && <Trash2 />}
            </div>
          </div>
        </header>

        <div className="flex flex-grow gap-8 min-h-0">
          {isSmall ? (
            <div className="flex flex-col gap-4 w-full min-h-fit">
              <Calendar
                mode="single"
                selected={date}
                onSelect={handleDateSelect}
                autoFocus={false}
                className="w-full rounded-lg border bg-white shadow-lg border-1"
                buttonVariant="ghost"
                modifiers={{
                  hasLog: (day) => {
                    const key = toYMD(day);
                    return !!logsByDate[key];
                  },
                }}
                modifiersClassNames={{
                  hasLog:
                    "relative after:absolute after:bottom-[2px] after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-blue-500",
                }}
              />

              {isValidLog ? (
                <Tabs
                  defaultValue="todo"
                  className="flex flex-col w-full h-full"
                >
                  <TabsList className="flex w-fit">
                    <TabsTrigger value="timetable">Timetable</TabsTrigger>
                    <TabsTrigger value="todo">To do</TabsTrigger>
                    <TabsTrigger value="memo">Memo</TabsTrigger>
                  </TabsList>
                  <TabsContent value="timetable" className="overflow-visible">
                    <DailyTimetablePanel dailyLogId={dailyLogId} />
                  </TabsContent>
                  <TabsContent value="todo" className="overflow-visible">
                    <DailyTodoPanel dailyLogId={dailyLogId} />
                  </TabsContent>
                  <TabsContent
                    value="memo"
                    className="flex-grow overflow-visible"
                  >
                    <MemoPanel
                      dailyLogId={dailyLogId}
                      memo={memo}
                      setMemo={setMemo}
                    />
                  </TabsContent>
                </Tabs>
              ) : (
                <DailyEmptyPage date={date} />
              )}
            </div>
          ) : (
            <>
              <div className="w-1/5 flex flex-col gap-8 min-w-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  autoFocus={false}
                  className="w-full rounded-lg border [--cell-size:--spacing(11)] md:[--cell-size:--spacing(12)] bg-white shadow-lg border-1"
                  buttonVariant="ghost"
                  modifiers={{
                    hasLog: (day) => {
                      const key = toYMD(day);
                      return !!logsByDate[key];
                    },
                  }}
                  modifiersClassNames={{
                    hasLog:
                      "relative after:absolute after:bottom-[2px] after:left-1/2 after:-translate-x-1/2 after:w-1.5 after:h-1.5 after:rounded-full after:bg-blue-500",
                  }}
                />
                {date && (
                  <div className="flex w-full min-w-0">
                    <DailyNoticePanel dailyLogDate={date} />
                  </div>
                )}
              </div>
              {isValidLog ? (
                <>
                  <div className="w-2/5 h-full flex flex-col min-h-0">
                    <DailyTimetablePanel dailyLogId={dailyLogId} />
                  </div>
                  <div className="w-2/5 h-full flex flex-col gap-8">
                    <div className="flex-[3]">
                      <DailyTodoPanel dailyLogId={dailyLogId} />
                    </div>

                    <div className="flex-[2]">
                      <MemoPanel
                        dailyLogId={dailyLogId}
                        memo={memo}
                        setMemo={setMemo}
                      />
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-4/5 h-full flex flex-col">
                  <DailyEmptyPage date={date} />
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <AlertConfirmModal
        open={isAlertOpen}
        message="이 데일리 로그를 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default DailyLogPage;
