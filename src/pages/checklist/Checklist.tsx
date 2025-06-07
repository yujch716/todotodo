import { useSearchParams } from "react-router-dom";
import ChecklistPanel from "@/pages/checklist/ChecklistPanel.tsx";
import MemoPanel from "@/pages/checklist/MemoPanel.tsx";
import EmptyChecklist from "@/pages/checklist/EmptyChecklist.tsx";
import { useEffect, useState } from "react";
import type { ChecklistItemType } from "@/types/checklist.ts";
import { fetchChecklistById } from "@/api/checklist.ts";

const Checklist = () => {
  const [searchParams] = useSearchParams();
  const checklistId = searchParams.get("id");
  const [title, setTitle] = useState("");
  const [date, setDate] = useState<Date | null>(null);
  const [items, setItems] = useState<ChecklistItemType[]>([]);
  const [memo, setMemo] = useState("");

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

  return (
    <div className="flex gap-8 flex-1 overflow-auto">
      <div className="w-1/2">
        <ChecklistPanel
          checklistId={checklistId}
          title={title}
          date={date}
          items={items}
          setTitle={setTitle}
          setItems={setItems}
        />
      </div>
      <div className="w-1/2">
        <MemoPanel
          checklistId={checklistId}
          memo={memo}
          setMemo={setMemo}
        />
      </div>
    </div>
  );
};

export default Checklist;
