import { useSearchParams } from "react-router-dom";
import ChecklistPanel from "@/pages/checklist/ChecklistPanel.tsx";
import MemoPanel from "@/pages/checklist/MemoPanel.tsx";
import EmptyChecklist from "@/pages/checklist/EmptyChecklist.tsx";
import { useEffect, useState } from "react";
import type { ChecklistItemType } from "@/types/checklist.ts";
import { fetchChecklistById, updateChecklistTitle } from "@/api/checklist.ts";
import {Trash2} from "lucide-react";

const Checklist = () => {
  const [searchParams] = useSearchParams();
  const checklistId = searchParams.get("id");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [memo, setMemo] = useState("");
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  if (!checklistId) {
    return (
      <div className="p-8">
        <EmptyChecklist />
      </div>
    );
  }

  useEffect(() => {
    const fetchData = async () => {
      if (!checklistId) return;
      const checklistData = await fetchChecklistById(checklistId);
      setTitle(checklistData.title);
      setDate(checklistData.date);
      setItems(checklistData.checklist_item || []);
      setMemo(checklistData.memo || "");
    };

    fetchData();
  }, [checklistId]);

  const handleTitleSave = async () => {
    const trimmedTitle = title.trim();

    if (trimmedTitle === "" || !checklistId) {
      setIsEditingTitle(false);
      return;
    }

    await updateChecklistTitle(checklistId, trimmedTitle);

    setIsEditingTitle(false);
  };

  return (
    <div className="flex flex-col flex-1 overflow-auto">
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
        <div className="w-1/2 flex justify-end">
          <Trash2 />
        </div>
      </header>

      <div className="flex gap-8 flex-1">
        <div className="w-1/2 overflow-auto">
          <ChecklistPanel
            checklistId={checklistId}
            items={items}
            setItems={setItems}
          />
        </div>
        <div className="w-1/2 overflow-auto">
          <MemoPanel checklistId={checklistId} memo={memo} setMemo={setMemo} />
        </div>
      </div>
    </div>
  );
};

export default Checklist;
