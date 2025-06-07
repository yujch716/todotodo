import { useNavigate, useSearchParams } from "react-router-dom";
import ChecklistPanel from "@/pages/checklist/ChecklistPanel.tsx";
import MemoPanel from "@/pages/checklist/MemoPanel.tsx";
import { useCallback, useEffect, useState } from "react";
import type { ChecklistItemType } from "@/types/checklist.ts";
import {
  deleteChecklistById,
  fetchChecklistById,
  updateChecklistTitle,
} from "@/api/checklist.ts";
import { Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress.tsx";
import { ChecklistStatusIcon } from "@/components/ChecklistStatusIcon.tsx";
import { useChecklistSidebarStore } from "@/store/checklistSidebarStore.ts";
import { useChecklistDetailStore } from "@/store/checklistDetailStore.ts";
import EmptyChecklist from "@/pages/checklist/EmptyChecklist.tsx";
import AlertConfirmModal from "@/components/AlertConfirmModal.tsx";

const Checklist = () => {
  const navigate = useNavigate();

  const [searchParams] = useSearchParams();
  const checklistId = searchParams.get("id");

  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [memo, setMemo] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [checkedCount, setCheckedCount] = useState(0);

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);

  const refreshChecklist = useChecklistDetailStore(
    (store) => store.refreshChecklist,
  );
  const resetChecklistRefresh = useChecklistDetailStore(
    (store) => store.resetChecklistRefresh,
  );

  const loadChecklist = useCallback(async () => {
    if (!checklistId) return;

    const checklistData = await fetchChecklistById(checklistId);

    setTitle(checklistData.title);
    setDate(checklistData.date);
    setItems(checklistData.checklist_item || []);
    setMemo(checklistData.memo || "");
    setTotalCount(checklistData.totalCount);
    setCheckedCount(checklistData.checkedCount);
  }, [checklistId]);

  useEffect(() => {
    loadChecklist();
  }, [loadChecklist]);

  useEffect(() => {
    if (refreshChecklist) {
      loadChecklist();
      resetChecklistRefresh();
    }
  }, [loadChecklist, refreshChecklist, resetChecklistRefresh]);

  const progressValue = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const triggerSidebarRefresh = useChecklistSidebarStore(
    (state) => state.triggerSidebarRefresh,
  );

  const handleTitleSave = async () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === "" || !checklistId) {
      setIsEditingTitle(false);
      return;
    }

    await updateChecklistTitle(checklistId, trimmedTitle);

    triggerSidebarRefresh();

    setIsEditingTitle(false);
  };

  const handleDelete = async () => {
    if (!checklistId) return;

    setIsAlertOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!checklistId) return;
    setIsAlertOpen(false);

    try {
      await deleteChecklistById(checklistId);
      triggerSidebarRefresh();

      navigate("/calendar");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  if (!checklistId) return <EmptyChecklist />;

  return (
    <>
      <div className="flex flex-col h-full overflow-hidden">
        <header className="flex gap-8 mb-5 items-center">
          <div className="w-1/2">
            <div className="text-sm text-gray-500 mb-1">
              {date ? String(date) : null}
            </div>
            <div className="pt-2 text-xl font-bold">
              {isEditingTitle ? (
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  onBlur={handleTitleSave}
                  onKeyDown={(e) => e.key === "Enter" && handleTitleSave()}
                  className="w-full border-b border-gray-300 focus:outline-none"
                  autoFocus
                />
              ) : (
                <h2
                  className="w-full cursor-pointer"
                  onClick={() => setIsEditingTitle(true)}
                >
                  {title}
                </h2>
              )}
            </div>
          </div>

          <div className="w-1/2 flex items-center gap-2">
            <div className="flex items-center gap-2 flex-grow">
              <ChecklistStatusIcon
                checkedCount={checkedCount}
                totalCount={totalCount}
                iconClassName="w-6 h-6"
              />
              <div className="w-2/3">
                <Progress value={progressValue} className="border-2" />
              </div>
            </div>
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
            <ChecklistPanel
              checklistId={checklistId}
              items={items}
              setItems={setItems}
            />
          </div>
          <div className="w-1/2 h-full flex flex-col overflow-auto">
            <MemoPanel
              checklistId={checklistId}
              memo={memo}
              setMemo={setMemo}
            />
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

export default Checklist;
