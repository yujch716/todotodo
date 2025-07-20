import { useNavigate, useSearchParams } from "react-router-dom";
import DailyTodoPanel from "@/pages/daily-log/DailyTodoPanel.tsx";
import MemoPanel from "@/pages/daily-log/MemoPanel.tsx";
import { useCallback, useEffect, useState } from "react";
import { deleteDailyLogById, getDailyLogById } from "@/api/daily-log.ts";
import { Trash2 } from "lucide-react";
import { useDailyLogSidebarStore } from "@/store/dailyLogSidebarStore.ts";
import EmptyDailyLog from "@/pages/daily-log/EmptyDailyLog.tsx";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";

const DailyLog = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const dailyLogId = searchParams.get("id");

  const [date, setDate] = useState<Date | null>(null);
  const [memo, setMemo] = useState("");

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const loadDailyLog = useCallback(async () => {
    if (!dailyLogId) return;

    const dailyLog = await getDailyLogById(dailyLogId);

    setDate(dailyLog.date);
    setMemo(dailyLog.memo || "");
  }, [dailyLogId]);

  useEffect(() => {
    loadDailyLog();
  }, [loadDailyLog]);

  const triggerSidebarRefresh = useDailyLogSidebarStore(
    (state) => state.triggerSidebarRefresh,
  );

  const handleDelete = async () => {
    if (!dailyLogId) return;

    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!dailyLogId) return;
    setIsAlertOpen(false);

    try {
      await deleteDailyLogById(dailyLogId);
      triggerSidebarRefresh();

      navigate("/calendar");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  if (!dailyLogId) return <EmptyDailyLog />;

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <header className="flex gap-8 mb-5 items-center">
          <div className="w-1/2">
            <div className="text-sm text-gray-500 mb-1">
              {date ? String(date) : null}
            </div>
          </div>

          <div className="w-1/2 flex items-center gap-2">
            <div
              className="flex justify-end cursor-pointer hover:text-red-500"
              onClick={handleDelete}
            >
              <Trash2 />
            </div>
          </div>
        </header>

        <div className="flex flex-grow overflow-hidden gap-8">
          <div className="w-1/2 h-full flex flex-col overflow-auto">
            <DailyTodoPanel dailyLogId={dailyLogId} />
          </div>
          <div className="w-1/2 h-full flex flex-col overflow-auto">
            <MemoPanel dailyLogId={dailyLogId} memo={memo} setMemo={setMemo} />
          </div>
        </div>
      </div>
      <AlertConfirmModal
        open={isAlertOpen}
        message="이 체크리스트를 삭제하시겠습니까?"
        onConfirm={handleConfirmDelete}
        onCancel={() => setIsAlertOpen(false)}
      />
    </>
  );
};

export default DailyLog;
