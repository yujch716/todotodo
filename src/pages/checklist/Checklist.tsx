import { useNavigate, useSearchParams } from "react-router-dom";
import ChecklistPanel from "@/pages/checklist/ChecklistPanel.tsx";
import MemoPanel from "@/pages/checklist/MemoPanel.tsx";
import EmptyChecklist from "@/pages/checklist/EmptyChecklist.tsx";
import { useEffect, useState } from "react";
import type { ChecklistItemType } from "@/types/checklist.ts";
import {
  deleteChecklistById,
  fetchChecklistById,
  updateChecklistTitle,
} from "@/api/checklist.ts";
import { Trash2 } from "lucide-react";
import { Progress } from "@/components/ui/progress.tsx";
import { ChecklistStatusIcon } from "@/components/ChecklistStatusIcon.tsx";
import {useChecklistSidebarStore} from "@/store/checklistSidebarStore.ts";
import {useChecklistDetailStore} from "@/store/checklistDetailStore.ts";

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

  if (!checklistId) {
    return (
      <div className="p-8">
        <EmptyChecklist />
      </div>
    );
  }

  const refreshChecklist = useChecklistDetailStore((store) => store.refreshChecklist);
  const resetChecklistRefresh =  useChecklistDetailStore((store) => store.resetChecklistRefresh);

  const loadChecklist = async () => {
    const checklistData = await fetchChecklistById(checklistId);

    setTitle(checklistData.title);
    setDate(checklistData.date);
    setItems(checklistData.checklist_item || []);
    setMemo(checklistData.memo || "");
    setTotalCount(checklistData.totalCount);
    setCheckedCount(checklistData.checkedCount);
  }

  useEffect(() => {
    loadChecklist()
  }, [checklistId]);

  useEffect(() => {
    if (refreshChecklist) {
      loadChecklist();
      resetChecklistRefresh();
    }
  }, [refreshChecklist]);

  const progressValue = totalCount > 0 ? (checkedCount / totalCount) * 100 : 0;

  const triggerSidebarRefresh = useChecklistSidebarStore((state) => state.triggerSidebarRefresh);

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
    if (!window.confirm("이 체크리스트를 정말 삭제하시겠습니까?")) return;

    try {
      await deleteChecklistById(checklistId);
      triggerSidebarRefresh();

      navigate("/calendar");
    } catch (error) {
      console.error("삭제 실패:", error);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
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
          <MemoPanel checklistId={checklistId} memo={memo} setMemo={setMemo} />
        </div>
      </div>
    </div>
  );
};

export default Checklist;
